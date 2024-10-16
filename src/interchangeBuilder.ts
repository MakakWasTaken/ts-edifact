/* eslint-disable no-case-declarations */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

import * as fs from 'node:fs'
import type { Separators } from './edi/separators'
import { type MessageHeader, type Segment, toSegmentObject } from './edifact'
import {
  APERAK,
  AUTHOR,
  BALANC,
  DESADV,
  GENRAL,
  IFTMIN,
  INVOIC,
  INVRPT,
  ORDERS,
  OSTENQ,
  OSTRPT,
  PARTIN,
  TAXCON,
  VATDEC,
} from './index'
import type { ResultType } from './reader'
import { type MessageType, Pointer } from './tracker'
import { formatComponents } from './util'
import type { ElementEntry } from './validator'

export class Group {
  name: string
  parent: Message | Group
  data: (Group | Segment)[] = []

  constructor(name: string, parent: Message | Group) {
    this.name = name
    this.parent = parent
  }

  addSegment(segment: Segment): void {
    if (segment) {
      this.data.push(segment)
    }
  }

  addGroup(group: Group): void {
    if (group) {
      this.data.push(group)
    }
  }

  groupCount(): number {
    let count = 0
    for (const group of this.data) {
      if (group instanceof Group) {
        count++
      }
    }
    return count
  }

  containsGroup(groupName: string): boolean {
    for (const group of this.data) {
      if (group instanceof Group && group.name === groupName) {
        return true
      }
    }
    return false
  }

  groupByName(groupName: string): Group | undefined {
    for (const group of this.data) {
      if (group instanceof Group && group.name === groupName) {
        return group
      }
    }
    return undefined
  }
}

export class Message {
  messageHeader: MessageHeader
  header: (Group | Segment)[] = []
  detail: (Group | Segment)[] = []
  summary: (Group | Segment)[] = []

  constructor(data: ResultType) {
    const formattedComponents = formatComponents(data.elements, data.name)
    this.messageHeader = formattedComponents as MessageHeader
  }

  addSegment(segment: Segment, sectionName: string): void {
    this.section(sectionName).push(segment)
  }

  addGroup(group: Group, sectionName: string): void {
    this.section(sectionName).push(group)
  }

  private section(name?: string): (Group | Segment)[] {
    if (name === 'header') {
      return this.header
    }
    if (name === 'detail') {
      return this.detail
    }
    if (name === 'summary') {
      return this.summary
    }
    return this.header.concat(this.detail).concat(this.summary)
  }

  groupCount(sectionName?: string): number {
    let count = 0
    for (const group of this.section(sectionName)) {
      if (group instanceof Group) {
        count++
      }
    }
    return count
  }

  containsGroup(groupName: string, sectionName?: string): boolean {
    for (const group of this.section(sectionName)) {
      if (group instanceof Group && group.name === groupName) {
        return true
      }
    }
    return false
  }

  groupByName(groupName: string, sectionName?: string): Group | undefined {
    for (const group of this.section(sectionName)) {
      if (group instanceof Group && group.name === groupName) {
        return group
      }
    }
    return undefined
  }
}

export interface SyntaxIdentifier {
  syntaxIdentifer: string
  syntaxVersionNumber: string
  serviceCodeListDirectoryVersionNumber: string | undefined
  charEncoding: string | undefined
}

export interface Participant {
  id: string
  codeQualifier: string | undefined
  internalId: string | undefined
  internalSubId: string | undefined
}

export interface RecipientsRef {
  password: string
  passwordQualifier: string | undefined
}

export class Edifact {
  syntaxIdentifier: SyntaxIdentifier
  sender: Participant
  receiver: Participant
  date: string
  time: string
  interchangeNumber: string
  recipientsRef: RecipientsRef | undefined
  applicationRef: string | undefined
  processingPriorityCode: string | undefined
  ackRequest: number | undefined
  agreementId: string | undefined
  testIndicator: number

  messages: Message[] = []

  constructor(elements: ElementEntry[]) {
    const formattedElements = formatComponents(elements, 'UNH')
    this.syntaxIdentifier =
      formattedElements.syntaxIdentifier as SyntaxIdentifier
    this.sender = formattedElements.interchangeSender as Participant
    this.receiver = formattedElements.interchangeRecipient as Participant
    this.date = (formattedElements.dateAndTimeOfPreparation?.date ||
      '') as string
    this.time = (formattedElements.dateAndTimeOfPreparation?.time ||
      '') as string
    this.interchangeNumber = elements[4].components[0].value as string
    if (elements.length >= 6) {
      this.recipientsRef =
        formattedElements.interchangeControlReference as RecipientsRef
    }
    if (elements.length >= 7) {
      this.applicationRef = formattedElements.applicationReference as string
    }
    if (elements.length >= 8) {
      this.processingPriorityCode =
        formattedElements.processingPriorityCode as string
    }
    if (elements.length >= 9) {
      this.ackRequest = Number.parseInt(
        (formattedElements.acknowledgementRequest as string) || '',
      )
    }
    if (elements.length >= 10) {
      this.agreementId =
        formattedElements.interchangeAgreementIdentifier as string
    }
    if (elements.length === 11) {
      this.testIndicator = Number.parseInt(
        (formattedElements.testIndicator as string) || '',
      )
    } else {
      this.testIndicator = 0
    }
  }

  addMessage(message: Message): void {
    this.messages.push(message)
  }
}

export class InterchangeBuilder {
  interchange: Edifact

  private stack: Pointer[] = []
  private curSection = 'header'

  /**
   * Uses the provided parsing result to create an Edifact interchange structure. This
   * process will validate the order of the parsed segment definitions against available
   * Edifact message structure definition files, which are determined by the respective
   * version defined in the UNH segments of the parsing result.
   *
   * This process will fail if mandatory segments are missing of if any unexpected
   * segments, not defined in the message structure definition file, are found.
   *
   * @param parsingResult The actual result of the Edifact document parsing process.
   * @param basePath The base location the Edifact message structure definition files
   *                 in JSON format can be found
   */
  constructor(
    parsingResult: ResultType[],
    separators: Separators,
    basePath: string,
  ) {
    if (!parsingResult || parsingResult.length === 0) {
      throw Error('Invalid list of parsed segments provided')
    }

    let interchange: Edifact | undefined

    for (const segment of parsingResult) {
      if (segment.name === 'UNB') {
        interchange = new Edifact(segment.elements)
        continue
      }
      if (segment.name === 'UNZ') {
        continue
      }
      if (segment.name === 'UNH') {
        const message: Message = new Message(segment)
        // lookup the message definition for the respective edifact version, i.e. D96A => INVOIC
        const messageVersion: string =
          message.messageHeader.messageIdentifier.messageVersionNumber +
          message.messageHeader.messageIdentifier.messageReleaseNumber
        const messageType: string =
          message.messageHeader.messageIdentifier.messageType
        const table: MessageType[] = this.getMessageStructureDefForMessage(
          basePath,
          messageVersion,
          messageType,
        )
        this.stack = [new Pointer(table, 0)]
        this.curSection = 'header'

        if (interchange) {
          interchange.addMessage(message)
        } else {
          throw Error('')
        }
      }

      /* eslint-disable no-case-declarations */
      const message: Message | undefined =
        interchange?.messages[interchange.messages.length - 1]
      if (message) {
        const messageVersion: string =
          message.messageHeader.messageIdentifier.messageVersionNumber +
          message.messageHeader.messageIdentifier.messageReleaseNumber
        this.accept(
          segment,
          message,
          messageVersion,
          separators.decimalSeparator,
        )
      } else {
        throw Error(
          `Couldn't process ${segment.name} segment as no message was found.`,
        )
      }
      if (segment.name === 'UNT') {
        this.reset()
      }
    }

    if (interchange) {
      this.interchange = interchange
    } else {
      throw Error('Could not generate EDIFACT interchange structure')
    }
  }

  private reset(): void {
    this.stack.length = 1
    this.stack[0].position = 0
    this.stack[0].count = 0
  }

  private accept(
    segment: ResultType,
    obj: Message,
    version: string,
    decimalSeparator: string,
  ): void {
    let current: Pointer = this.stack[this.stack.length - 1]
    let optionals: number[] = []
    let probe = 0

    while (
      segment.name !== current.content() ||
      current.count === current.repetition()
    ) {
      if (
        Array.isArray(current.content()) &&
        current.count < current.repetition()
      ) {
        // Enter the subgroup
        probe++
        if (!current.mandatory()) {
          optionals.push(this.stack.length)
        }

        current.count++
        current = new Pointer(current.content() as MessageType[], 0)
        this.stack.push(current)
      } else {
        // Check if we are omitting mandatory content
        if (current.mandatory() && current.count === 0) {
          if (optionals.length === 0) {
            const segName: string | undefined = current.name()
            if (segName) {
              throw new Error(
                `A mandatory segment ${
                  current.content() as string
                } defined in segment group '${segName}' is missing`,
              )
            }
            // We will never encounter groups here, so we can safely use the
            // name of the segment stored in it's content property
            throw new Error(
              `A mandatory segment ${current.content() as string} is missing`,
            )
          }
          // If we are omitting mandatory content inside a conditional group,
          // we just skip the entire group
          probe = probe - this.stack.length
          this.stack.length = optionals.pop() as number
          current = this.stack[this.stack.length - 1]
          probe = probe + this.stack.length
        }

        current.position++
        current.count = 0
        const sect: string | undefined = current.section()
        if (sect) {
          this.curSection = sect
        }
        if (current.position === current.array.length) {
          this.stack.pop()
          current = this.stack[this.stack.length - 1]
          if (this.stack.length === 0) {
            throw new Error(
              `Reached the end of the segment table while processing segment ${segment.name}`,
            )
          }
          if (probe === 0 && current.count < current.repetition()) {
            // If we are not currently probing (meaning the tracker actually
            // accepted the group), we should retry the current group, except if
            // the maximum number of repetition was reached
            probe++
            optionals = [this.stack.length]
            current.count++
            current = new Pointer(current.content() as MessageType[], 0)
            this.stack.push(current)
          } else {
            if (!current.mandatory() || current.count > 1) {
              optionals.pop()
            }
            // Decrease the probing level only if the tracker is currently in a
            // probing state
            probe = probe > 0 ? probe - 1 : 0
            // Make sure the tracker won't enter the current group again by
            // setting an appropriate count value on the groups pointer
            current.count = current.repetition()
          }
        }
      }
    }
    current.count += 1

    // Generate the tree-structure of the Edifact document
    if (this.stack.length > 1) {
      let curObj: Message | Group = obj
      for (let idx = 0; idx < this.stack.length; idx++) {
        const pointer: Pointer = this.stack[idx]
        const groupName: string | undefined = pointer.name()
        if (groupName) {
          if (!curObj.containsGroup(groupName)) {
            const group: Group = new Group(groupName, curObj)
            curObj.addGroup(group, this.curSection)
            curObj = group
          } else {
            const group: Group | undefined = curObj.groupByName(groupName)
            if (group) {
              curObj = group
              // check wheter the stack count is larger than 1, if so, we know that
              // there is a repetition going on, which we would like to put into
              // their own subgroups.
              if (pointer.count > 1) {
                // If the first entry in the object is not a group, we need to
                // pop everything from that group, create a new subgroup, assign
                // the popped fields to the subgroup and add the subgroup to the
                // group. We can assume that the first entry to a group will never
                // be a group itself but a segment
                if (!(group.data[0] instanceof Group)) {
                  const subGroup: Group = new Group('0', group)
                  for (const data of group.data) {
                    if (data instanceof Group) {
                      subGroup.addGroup(data)
                    } else {
                      subGroup.addSegment(data)
                    }
                  }
                  group.data = []
                  group.addGroup(subGroup)
                }
                const subGroup: Group | undefined = group.groupByName(
                  `${pointer.count - 1}`,
                )
                if (subGroup) {
                  curObj = subGroup
                } else {
                  const sg: Group = new Group(`${group.groupCount()}`, group)
                  group.addGroup(sg)
                  curObj = sg
                }
              }
            } else {
              throw Error(
                `Could not find group ${groupName} as part of ${curObj.toString()}`,
              )
            }
          }
        } else {
          const seg: Segment = toSegmentObject(
            segment,
            version,
            decimalSeparator,
          )
          curObj.addSegment(seg, this.curSection)
        }
      }
    } else {
      // UNH is already converted to a Message object, so we don't need to store
      // that data again
      if (segment.name !== 'UNH') {
        const seg: Segment = toSegmentObject(segment, version, decimalSeparator)
        obj.addSegment(seg, this.curSection)
      }
    }
  }

  private getMessageStructureDefForMessage(
    basePath: string,
    messageVersion: string,
    messageType: string,
  ): MessageType[] {
    let path = `${basePath + messageVersion}_${messageType}.struct.json`
    if (fs.existsSync(path)) {
      return this.readFileAsMessageStructure(path)
    }
    path = `${basePath + messageType}struct.json`
    if (fs.existsSync(path)) {
      return this.readFileAsMessageStructure(path)
    }
    switch (messageType) {
      // default back to D01B messages
      case 'APERAK':
        return APERAK
      case 'AUTHOR':
        return AUTHOR
      case 'BALANC':
        return BALANC
      case 'DESADV':
        return DESADV
      case 'GENRAL':
        return GENRAL
      case 'IFTMIN':
        return IFTMIN
      case 'INVOIC':
        return INVOIC
      case 'INVRPT':
        return INVRPT
      case 'ORDERS':
        return ORDERS
      case 'OSTENQ':
        return OSTENQ
      case 'OSTRPT':
        return OSTRPT
      case 'PARTIN':
        return PARTIN
      case 'TAXCON':
        return TAXCON
      case 'VATDEC':
        return VATDEC
      default:
        throw new Error(
          `Could not find message definiton for message type '${messageType}' of version '${messageVersion}'`,
        )
    }
  }

  private readFileAsMessageStructure(path: string): MessageType[] {
    const data: string = fs.readFileSync(path, { encoding: 'utf-8' })
    return JSON.parse(data) as MessageType[]
  }
}
