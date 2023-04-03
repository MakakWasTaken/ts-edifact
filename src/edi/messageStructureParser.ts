/**
 * @author Roman Vottner
 * @copyright 2020 Roman Vottner
 * @license Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DomHandler, Parser } from 'htmlparser2'
import { HttpClient } from '../httpClient'
import { MessageType } from '../tracker'
import { isDefined } from '../util'
import {
  Component,
  ComponentValueEntry,
  Dictionary,
  ElementEntry,
  SegmentEntry,
} from '../validator'

export interface EdifactMessageSpecification {
  readonly messageType: string
  readonly version: string
  readonly release: string
  readonly controllingAgency: string

  readonly componentValueTable: Dictionary<ComponentValueEntry>

  /**
   * Contains the available segments as key and the respective elements
   * a segment contains as well as the mandatory count as value
   */
  readonly segmentTable: Dictionary<SegmentEntry>
  /**
   * Contains the actual message structure generatedby this parser
   */
  readonly messageStructureDefinition: MessageType[]

  type(): string
  versionAbbr(): string
}

export class EdifactMessageSpecificationImpl
  implements EdifactMessageSpecification
{
  messageType: string
  version: string
  release: string
  controllingAgency: string

  segmentTable: Dictionary<SegmentEntry> = new Dictionary<SegmentEntry>()
  elementTable: Dictionary<ElementEntry> = new Dictionary<ElementEntry>()
  componentValueTable: Dictionary<ComponentValueEntry> =
    new Dictionary<ComponentValueEntry>()
  messageStructureDefinition: MessageType[] = []

  constructor(
    messageType: string,
    version: string,
    release: string,
    controllingAgency: string,
  ) {
    this.messageType = messageType
    this.version = version
    this.release = release
    this.controllingAgency = controllingAgency
  }

  public type(): string {
    return this.version + this.release + '_' + this.messageType
  }

  public versionAbbr(): string {
    return this.version + this.release
  }
}

enum Part {
  BeforeStructureDef,
  RefLink,
  Pos,
  Tag,
  Deprecated,
  Name,
  AfterStructureDef,
}

enum SegmentPart {
  BeforeStructureDef,
  Data,
  AfterStructureDef,
}

export type ParsingResultType = {
  specObj: EdifactMessageSpecification
  promises: Promise<EdifactMessageSpecification>[]
}

export interface MessageStructureParser {
  loadTypeSpec(): Promise<EdifactMessageSpecification>
}

export class UNECEMessageStructureParser implements MessageStructureParser {
  readonly version: string
  readonly type: string
  readonly httpClient: HttpClient

  constructor(version: string, type: string) {
    this.version = version.toLowerCase()
    this.type = type.toLowerCase()

    const baseUrl: string =
      'https://service.unece.org/trade/untdid/' +
      this.version +
      '/trmd/' +
      this.type +
      '_c.htm'
    this.httpClient = new HttpClient(baseUrl)
  }

  private extractTextValue(text: string, regex: RegExp, index = 0): string {
    const arr: RegExpExecArray | null = regex.exec(text)
    if (isDefined(arr)) {
      return arr[index]
    }
    return ''
  }

  protected async loadPage(page: string): Promise<string> {
    const data: string = await this.httpClient.get(page)
    return data
  }

  protected formatComponentName(name?: string): string | undefined {
    if (!name || name === '') {
      return undefined
    }
    let formattedName: string = name.replace(/\//g, ' or ') // Replace / with Or to avoid problems with versioning
    formattedName = formattedName.replace(/&|,|-/g, ' ')
    const split = formattedName.split(' ')
    if (split.length > 0) {
      const formattedNames = split.map(
        (part: string) =>
          part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
      )
      const result =
        formattedNames[0].toLowerCase() + formattedNames.slice(1).join('')
      if (name.includes('/')) {
        console.log(formattedNames, result)
      }

      return result
    }
    return undefined
  }

  protected async parseComponentDefinitionPage(
    component: string,
    page: string,
    definition: EdifactMessageSpecification,
  ): Promise<EdifactMessageSpecification> {
    // Check if the component already exists (Meaning it has been handled)
    if (definition.componentValueTable.contains(component)) {
      return definition
    }
    if (page.includes('Use code list for data element')) {
      const regexp = /Use code list for data element ([0-9]*)/gm
      const arr: RegExpExecArray | null = regexp.exec(page)

      if (isDefined(arr)) {
        const referencedComponent = arr[1]
        const referencedComponentPage: string = await this.loadPage(
          '../tred/tred' + referencedComponent + '.htm',
        )
        return this.parseComponentDefinitionPage(
          component,
          referencedComponentPage,
          definition,
        )
      }
    }
    if (
      !page.includes('Code Values:') // Does not contain possible values.
    ) {
      return definition
    }

    let state: SegmentPart = SegmentPart.BeforeStructureDef

    const values: ComponentValueEntry = {}

    for (let line of page.split(/\n\s*\n/)) {
      line = line.trimEnd()

      if (
        state === SegmentPart.BeforeStructureDef &&
        line.toLowerCase().includes('<h3>')
      ) {
        state = SegmentPart.Data
      } else if (
        state === SegmentPart.Data &&
        !line.toLowerCase().includes('<p>')
      ) {
        const regexp: RegExp = /^(\S)?\s*([A-Z0-9]{1,3}) +(.*)\n*([\w\W]*)/gm
        const arr: RegExpExecArray | null = regexp.exec(line)

        if (isDefined(arr)) {
          const deprecated: boolean | undefined =
            arr[1] === 'X' ? true : undefined
          const componentKey: string = arr[2]

          const componentValue: string = arr[3]
          const componentDescription: string = arr[4]
            .replace(/ {2,}/gm, ' ') // Convert all instances of multiple spaces to a single space
            .replace(/[\r\n]/gm, '') // Remove all newlines
            .trim() // Remove excess whitespace
          values[componentKey] = {
            id: componentKey,
            value: componentValue,
            description: componentDescription,
            ...(deprecated && { deprecated }), // Only add if deprecated is true
          }
        }
      } else if (
        state === SegmentPart.Data &&
        line.toLowerCase().includes('<p>')
      ) {
        state = SegmentPart.AfterStructureDef
        break
      }
    }

    if (component !== '' && Object.keys(values).length) {
      definition.componentValueTable.add(component, values)
    }

    return Promise.resolve(definition)
  }

  protected async parseSegmentDefinitionPage(
    segment: string,
    page: string,
    definition: EdifactMessageSpecification,
  ): Promise<EdifactMessageSpecification> {
    if (definition.segmentTable.contains(segment)) {
      return Promise.resolve(definition)
    }

    const segEntry: SegmentEntry = { requires: 0, elements: [] }
    let state: SegmentPart = SegmentPart.BeforeStructureDef

    // only relevant for legacy UNECE segment specification pages:
    let dataSection = false

    let skipAddingElement = false
    let overflowLine: string | null = null
    let complexEleId: string | null = null
    let complexEleEntry: ElementEntry | null = null
    for (let line of page.split('\n')) {
      line = line.trimEnd()
      if (overflowLine !== null) {
        line = overflowLine.trimStart() + ' ' + line.trim()
        overflowLine = null
      }

      if (state === SegmentPart.BeforeStructureDef && line.includes('<HR>')) {
        dataSection = true
      } else if (
        state === SegmentPart.BeforeStructureDef &&
        // checking dataSection and <B> tag only relevant for legacy
        // UNECE segment specification pages:
        (line.includes('<H3>') || (dataSection && line.includes('<B>')))
      ) {
        state = SegmentPart.Data
      } else if (state === SegmentPart.Data && !line.includes('<P>')) {
        const regexp: RegExp =
          /^\s*?([\d]*)\s*?([X|\\*]?)\s*<A(?:.*HREF.*"([\w /.]*)")?>([\w]*)<\/A>([\w ,\-\\/&]*)\W+([M|C])(?:\W|$)\s*([\d]*)\s*([\w\\.]*).*$/g
        const arr: RegExpExecArray | null = regexp.exec(line)
        if (isDefined(arr)) {
          const segGroupId: string | undefined =
            arr[1] === '' ? undefined : arr[1]
          // const deprecated: boolean = arr[2] === "X" ? true : false;
          const href: string | undefined = arr[3]
          const id: string = arr[4]
          const mandatory: boolean = arr[6] === 'M' ? true : false
          // const repetition: number | undefined = isDefined(arr[7]) ? parseInt(arr[7]) : undefined;
          const elementDef: string | undefined =
            arr[8] === '' ? undefined : arr[8]
          const componentName = this.formatComponentName(arr[5]?.trim())

          // Check if possibility for coded values

          if (href.includes('/tred/') && componentName?.includes('Code')) {
            // Check if already exists
            if (!definition.componentValueTable.contains(id)) {
              await this.parseComponentDefinitionPage(
                id,
                await this.loadPage(href),
                definition,
              )
            }
          }

          const component: Component | undefined =
            id && componentName && elementDef
              ? {
                  id,
                  name: componentName,
                  format: elementDef,
                }
              : undefined

          const eleEntry: ElementEntry = {
            id,
            name: componentName || '',
            requires: 0,
            components: [],
          }
          if (segGroupId) {
            if (id === '') {
              console.warn(
                `Could not determine element ID based on line ${line}`,
              )
              continue
            }
            skipAddingElement = false

            if (mandatory) {
              segEntry.requires = segEntry.requires + 1
            }
            if (component) {
              if (complexEleEntry !== null && complexEleId !== null) {
                segEntry.elements.push(complexEleEntry)
              }
              complexEleId = null
              complexEleEntry = null

              if (segEntry.elements.some((element) => element?.id === id)) {
                continue
              }
              if (mandatory) {
                eleEntry.requires = eleEntry.requires + 1
              }
              eleEntry.components.push(component)
              segEntry.elements.push(eleEntry)
            } else {
              if (complexEleEntry !== null && complexEleId !== null) {
                segEntry.elements.push(complexEleEntry)
              }
              // If the element already exists
              if (segEntry.elements.some((element) => element.id === id)) {
                skipAddingElement = true
                continue
              }
              complexEleId = id
              complexEleEntry = eleEntry
            }
          } else {
            if (!skipAddingElement) {
              if (complexEleEntry !== null && component) {
                complexEleEntry.components.push(component)
                complexEleEntry.requires = mandatory
                  ? complexEleEntry.requires + 1
                  : complexEleEntry.requires
              } else {
                // simple element definition
                if (segEntry.elements.some((element) => element.id === id)) {
                  continue
                }
                if (mandatory) {
                  eleEntry.requires = eleEntry.requires + 1
                }
                if (component) {
                  eleEntry.components.push(component)
                }
                eleEntry.id = id
                segEntry.elements.push(eleEntry)
              }
            }
          }
        } else {
          const regexpAlt =
            /^\s*([\d]*)\s*([X|\\*]?)\s*<A.*>([a-zA-Z0-9]*)<\/A>\s*([a-zA-Z0-9 \\-\\/&]*)/g
          const arrAlt: RegExpExecArray | null = regexpAlt.exec(line)
          if (isDefined(arrAlt)) {
            overflowLine = line
          }
        }
      } else if (state === SegmentPart.Data && line.includes('<P>')) {
        state = SegmentPart.AfterStructureDef
        break
      }
    }
    if (complexEleEntry !== null && complexEleId !== null) {
      segEntry.elements.push(complexEleEntry)
    }
    if (segment !== '') {
      definition.segmentTable.add(segment, segEntry)
    }

    return Promise.resolve(definition)
  }

  private async parseMessagePage(page: string): Promise<ParsingResultType> {
    let definition: EdifactMessageSpecification | undefined
    const handler: DomHandler = new DomHandler()

    let state: Part = Part.BeforeStructureDef
    let section: string | null = 'header'
    const segStack: MessageType[][] = []
    const lookupSegmentPromises: Promise<EdifactMessageSpecification>[] = []

    const nextState = () => {
      if (state === Part.RefLink) {
        state = Part.Pos
      } else if (state === Part.Pos) {
        state = Part.Deprecated
      } else if (state === Part.Deprecated) {
        state = Part.Tag
      } else if (state === Part.Tag) {
        state = Part.Name
      } else if (state === Part.Name) {
        state = Part.RefLink
      }
    }

    handler.ontext = (text: string) => {
      if (
        text.includes('Message Type') &&
        text.includes('Version') &&
        text.includes('Release')
      ) {
        const messageType: string = this.extractTextValue(
          text,
          /Message Type\s*: ([A-Z]*)\s/g,
          1,
        )
        const version: string = this.extractTextValue(
          text,
          /Version\s*: ([A-Z]*)\s/g,
          1,
        )
        const release: string = this.extractTextValue(
          text,
          /Release\s*: ([0-9A-Z]*)\s/g,
          1,
        )
        const controllingAgency: string = this.extractTextValue(
          text,
          /Contr. Agency\s*: ([0-9A-Z]*)\s/g,
          1,
        )
        definition = new EdifactMessageSpecificationImpl(
          messageType,
          version,
          release,
          controllingAgency,
        )
        segStack.push(definition.messageStructureDefinition)
      } else if (text.includes('Message structure')) {
        state = Part.RefLink
      } else if (
        state !== Part.BeforeStructureDef &&
        state !== Part.AfterStructureDef
      ) {
        if (state === Part.RefLink) {
          // ignored
          console.debug(`RefLink: ${text}`)
        } else if (state === Part.Pos) {
          // console.debug(`Pos: ${text}`);
        } else if (state === Part.Deprecated) {
          if (text.includes('- Segment group')) {
            const regex =
              /^[\s*+-]*-* (Segment group \d*)\s*-*\s*([M|C])\s*(\d*)([-|\\+|\\|]*).*/g
            const arr: RegExpExecArray | null = regex.exec(text)
            if (isDefined(arr)) {
              const groupArray: MessageType[] = []
              const group: MessageType = {
                content: groupArray,
                mandatory: arr[2] === 'M' ? true : false,
                repetition: parseInt(arr[3]),
                name: arr[1],
                section: isDefined(section) ? section : undefined,
              }
              section = null
              // add the group to the end of the current top segments
              segStack[segStack.length - 1].push(group)
              // push the array managed by this group to the end of the stack to fill it down the road
              segStack.push(groupArray)
            }
            // no further tags available, continue on the next line with the RefLink
            state = Part.RefLink
          } else {
            // console.debug(`Deprecated: ${text}`);
            nextState()
          }
        } else if (state === Part.Tag) {
          // console.debug(`Tag: ${text}`);
          const _section: string | undefined =
            section !== null ? section : undefined
          let _data: string[] | undefined
          if (definition) {
            _data =
              text === 'UNH'
                ? [definition.versionAbbr(), definition.messageType]
                : undefined
          }
          const segment: MessageType = {
            content: text,
            mandatory: false,
            repetition: 0,
            data: _data,
            section: _section,
          }
          if (definition) {
            segStack[segStack.length - 1].push(segment)
          }
          section = null
        } else if (state === Part.Name) {
          // console.debug(`Name: ${text}`);
          const regex = /^([a-zA-Z /\\-]*)\s*?([M|C])\s*?([0-9]*?)([^0-9]*)$/g
          const arr: RegExpExecArray | null = regex.exec(text)
          if (isDefined(arr)) {
            // const name: string = arr[1].trim();
            const sMandatory: string = arr[2]
            const sRepetition: string = arr[3]
            const remainder: string = arr[4]
            // console.debug(`Processing segment: ${name}`);

            // update the last element on the top-most stack with the respective data
            const segArr: MessageType[] = segStack[segStack.length - 1]
            const segData: MessageType = segArr[segArr.length - 1]
            segData.mandatory = sMandatory === 'M' ? true : false
            segData.repetition = parseInt(sRepetition)

            // check whether the remainder contains a closing hint for a subgroup: -...-++
            if (remainder.includes('-') && remainder.includes('+')) {
              for (let i = 0; i < remainder.split('+').length - 1; i++) {
                segStack.pop()
              }
            }

            nextState()
          }
          if (text.includes('DETAIL SECTION')) {
            section = 'detail'
          } else if (text.includes('SUMMARY SECTION')) {
            section = 'summary'
          }
        } else {
          console.warn(`Unknown part: ${text}`)
        }
      }
    }
    handler.onopentag = (name: string, attribs: { [key: string]: string }) => {
      if (
        name === 'p' &&
        state !== Part.BeforeStructureDef &&
        state !== Part.AfterStructureDef
      ) {
        state = Part.AfterStructureDef
      }
      if (state === Part.Tag && attribs.href !== undefined) {
        if (definition) {
          const end: number = attribs.href.indexOf('.htm')
          const curSeg: string = attribs.href
            .substring(end - 3, end)
            .toUpperCase()

          // skip segments that do not point to the right segment definition page
          if (curSeg !== 'UNH' && curSeg !== 'UNS' && curSeg !== 'UNT') {
            // console.debug(`Adding promise to lookup segment definition for segment ${curSeg} for URI ${attribs.href}`);

            const def: EdifactMessageSpecification = definition
            lookupSegmentPromises.push(
              this.loadPage(attribs.href).then((result) =>
                this.parseSegmentDefinitionPage(curSeg, result, def),
              ),
            )
          }
        }
      }
    }
    handler.onclosetag = () => {
      nextState()
    }
    const parser: Parser = new Parser(handler)
    parser.write(page)
    parser.end()

    if (definition) {
      return Promise.resolve({
        specObj: definition,
        promises: lookupSegmentPromises,
      })
    }
    return Promise.reject(
      new Error('Could not extract values from read page successfully'),
    )
  }

  loadTypeSpec(): Promise<EdifactMessageSpecification> {
    const url: string = './' + this.type + '_c.htm'
    return this.loadPage(url)
      .then((page: string) => this.parseMessagePage(page))
      .then((result: ParsingResultType) =>
        Promise.all(result.promises)
          .then(() => result.specObj)
          .catch((error: Error) => {
            console.warn(
              `Error while processing segment definition promises: Reason ${error.message}`,
            )
            return result.specObj
          }),
      )
  }
}
