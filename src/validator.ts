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

import type { Tokenizer } from './tokenizer'

export class Dictionary<T> {
  private entries: { [key: string]: T }

  constructor(data?: { [key: string]: T }) {
    this.entries = {}

    if (data) {
      for (const key in data) {
        if (key !== '') {
          this.add(key, data[key])
        }
      }
    }
  }

  contains(key: string): boolean {
    if (Object.prototype.hasOwnProperty.call(this.entries, key)) {
      return true
    }
    return false
  }

  get(key: string): T | undefined {
    if (this.contains(key)) {
      return this.entries[key]
    }
    return undefined
  }

  keys(): string[] {
    return Object.keys(this.entries)
  }

  add(key: string, value: T): T {
    this.entries[key] = value
    return value
  }

  length(): number {
    return this.keys().length
  }
}

export type Component = {
  id: string
  name: string
  value?: string | ComponentValue
  format: string
}
export type SegmentEntry = {
  requires: number
  elements: ElementEntry[]
}
export type ElementEntry = {
  id: string
  name: string
  requires: number
  components: Component[]
}
export type ComponentValue = {
  id: string
  value: string
  description: string
  deprecated?: boolean
}
export type ComponentValueEntry = { [key: string]: ComponentValue }

interface FormatType {
  alpha: boolean
  numeric: boolean
  minimum: number
  maximum: number
}

export enum ValidatorStates {
  /**
   * Setting validation to none will disable the validator completely. The
   * validator will not even try to obtain a segment description for segments
   * encountered. Almost all overhead is eliminated in this state.
   */
  NONE = 0,
  /**
   * The segments state implies no segment definition was found for the current
   * segment, so validation should be disabled for its elements and components.
   * Normal validation should be resumed, however, as of the next segment.
   */
  SEGMENTS = 1,
  /**
   * The elements state is equivalent to the segments state, but validation is
   * only temporary disabled for the current element. Normal validation resumes
   * as of the next element.
   */
  ELEMENTS = 2,
  /**
   * Validation is enabled for all entities, including segments, elements and
   * components.
   */
  ALL = 3,
  ENTER = 4,
  ENABLE = 5,
}

export interface Validator {
  onOpenSegment(segment: string): SegmentEntry | undefined
  onElement(): ElementEntry | undefined
  onOpenComponent(buffer: Tokenizer): void
  onCloseComponent(buffer: Tokenizer): Component | undefined
  onCloseSegment(segment: string): void

  disable(): void
  enable(): void
  define(definitions: Dictionary<SegmentEntry>): void
  format(formatString: string): FormatType | undefined
}

export class NullValidator implements Validator {
  onOpenSegment(): undefined {
    return undefined
  }

  onElement(): undefined {
    return undefined
  }

  onOpenComponent(): void {}

  onCloseComponent(): undefined {
    return undefined
  }

  onCloseSegment(): void {}

  disable(): void {}

  enable(): void {}

  define(): void {}
  format(): FormatType | undefined {
    return undefined
  }
}

/**
 * The `Validator` can be used as an add-on to `Parser` class, to enable
 * validation of segments, elements and components. This class implements a
 * tolerant validator, only segments and elemens for which definitions are
 * provided will be validated. Other segments or elements will pass through
 * untouched. Validation includes:
 * * Checking data element counts, including mandatory elements.
 * * Checking component counts, including mandatory components.
 * * Checking components against they're required format.
 */
export class ValidatorImpl implements Validator {
  private segments: Dictionary<SegmentEntry> = new Dictionary<SegmentEntry>()
  private formats: Dictionary<FormatType> = new Dictionary<FormatType>()
  private counts = {
    segment: 0,
    element: 0,
    component: 0,
  }
  private state: ValidatorStates

  private segment: SegmentEntry | undefined = undefined
  private element: ElementEntry | undefined = undefined
  private component: FormatType | undefined = undefined

  private required = 0
  private minimum = 0
  private maximum = 0

  private throwOnMissingDefinitions: boolean

  constructor(throwOnMissingDefinitions = false) {
    this.state = ValidatorStates.ALL
    this.throwOnMissingDefinitions = throwOnMissingDefinitions
  }

  /**
   * @summary Enable validation on the next segment.
   */
  public disable(): void {
    this.state = ValidatorStates.NONE
  }

  /**
   * @summary Enable validation on the next segment.
   */
  public enable(): void {
    this.state = ValidatorStates.SEGMENTS
  }

  public define(definitions: Dictionary<SegmentEntry>): void {
    for (const key of definitions.keys()) {
      const entry: SegmentEntry | undefined = definitions.get(key)
      if (entry) {
        this.segments.add(key, entry)
      }
    }
  }

  /**
   * @summary Request a component definition associated with a format string.
   * @returns A component definition.
   */
  format(formatString: string): FormatType | undefined {
    // Check if we have a component definition in cache for this format string.
    if (this.formats.contains(formatString)) {
      return this.formats.get(formatString)
    }
    let parts: RegExpExecArray | null
    if ((parts = /^(a|an|n)(\.\.)?([1-9][0-9]*)?$/.exec(formatString))) {
      const max: number = Number.parseInt(parts[3])
      const min: number = parts[2] === '..' ? 0 : max
      let alpha = false
      let numeric = false
      switch (parts[1]) {
        case 'a':
          alpha = true
          break
        case 'n':
          numeric = true
          break
        case 'an':
          alpha = true
          numeric = true
          break
      }

      return this.formats.add(formatString, {
        alpha: alpha,
        numeric: numeric,
        minimum: min,
        maximum: max,
      })
    }
    throw this.errors.invalidFormatString(formatString)
  }

  /**
   * Called when a adding a new segment to the parser
   * @param segment The segment as a string
   * @returns The segment entry
   */
  onOpenSegment(segment: string): SegmentEntry | undefined {
    switch (this.state) {
      case ValidatorStates.ALL:
      case ValidatorStates.ELEMENTS:
      case ValidatorStates.SEGMENTS:
      case ValidatorStates.ENABLE:
        // Try to retrieve a segment definition if validation is not turned off.
        if ((this.segment = this.segments.get(segment))) {
          // The onelement function will close the previous element, however we
          // don't want the component counts to be checked. To disable them we put
          // the validator in the elements state.
          this.state = ValidatorStates.ELEMENTS
        } else {
          const error: Error | undefined = this.errors.missingSegmentDefinition(
            segment,
            this.throwOnMissingDefinitions,
          )
          if (error) {
            throw error
          }
        }
    }
    this.counts.segment += 1
    this.counts.element = 0
    return this.segment
  }

  onElement(): ElementEntry | undefined {
    let name: string

    switch (this.state) {
      // biome-ignore lint/suspicious/noFallthroughSwitchClause: Fall through to continue with element count validation
      case ValidatorStates.ALL:
        if (this.segment === undefined) {
          const error: Error | undefined = this.errors.missingSegmentStart(
            undefined,
            this.throwOnMissingDefinitions,
          )
          if (error) {
            throw error
          }
          return
        }
        name = this.segment.elements[this.counts.element]?.id
        if (this.element === undefined) {
          throw this.errors.missingElementStart(name)
        }

        // Check component of the previous enter
        if (
          this.counts.component < this.element.requires ||
          this.counts.component > this.element.components.length
        ) {
          throw this.errors.countError(
            'Element',
            name,
            this.element,
            this.counts.component,
          )
        }
      case ValidatorStates.ENTER:
      // Skip component count checks for the first element
      case ValidatorStates.ELEMENTS:
        if (this.segment === undefined) {
          const error: Error | undefined = this.errors.missingSegmentStart(
            undefined,
            this.throwOnMissingDefinitions,
          )
          if (error) {
            throw error
          }
          return
        }
        // Get the current element
        if ((this.element = this.segment.elements[this.counts.element])) {
          this.state = ValidatorStates.ALL
        } else {
          this.state = ValidatorStates.ELEMENTS
          if (this.throwOnMissingDefinitions) {
            throw this.errors.missingElementDefinition(
              this.counts.element.toString(),
              this.counts.segment.toString(),
            )
          }
        }
    }
    // Move to the next element
    this.counts.element += 1
    // Reset component, as we are done with this element
    this.counts.component = 0
    return this.element
  }

  /**
   * @summary Start validation for a new component.
   * @param buffer - An object which implements the buffer interface.
   *
   * The buffer object should allow the mode to be set to alpha, numeric or
   * alphanumeric with their corresponding methods.
   */
  onOpenComponent(buffer: Tokenizer): void {
    if (this.segment === undefined) {
      const error: Error | undefined = this.errors.missingSegmentStart(
        undefined,
        this.throwOnMissingDefinitions,
      )
      if (error) {
        throw error
      }
      return
    }

    switch (this.state) {
      case ValidatorStates.ALL: {
        // Used to display the error message
        const currentElement: ElementEntry =
          this.segment.elements[this.counts.element]
        if (this.element === undefined) {
          throw this.errors.missingElementStart(currentElement?.id)
        }
        if (typeof this.element === 'string') {
          throw new Error(
            `Element is a string ${currentElement?.id}` || this.element,
          )
        }

        // Retrieve a component definition if validation is set to all

        this.component = this.format(
          this.element.components[this.counts.component]?.format || '',
        )
        if (this.component === undefined) {
          return
        }
        this.required = this.element.requires
        this.minimum = this.component.minimum
        this.maximum = this.component.maximum
        // Set the corresponding buffer mode
        if (this.component.alpha) {
          if (this.component.numeric) {
            buffer.alphanumeric()
          } else {
            buffer.alpha()
          }
        } else {
          if (this.component.numeric) {
            buffer.numeric()
          } else {
            buffer.alphanumeric()
          }
        }
        break
      }
      default:
        // Set the buffer to its default mode
        buffer.alphanumeric()
    }
    this.counts.component += 1
  }

  onCloseComponent(buffer: Tokenizer): Component | undefined {
    let length: number

    // Hold the component we are closing
    let currentComponent: Component | undefined
    switch (this.state) {
      case ValidatorStates.ALL:
        // Component validation is only needed when validation is set to all
        length = buffer.length()
        if (this.segment) {
          if (this.element) {
            currentComponent = this.element.components[this.counts.component]
          } else {
            console.error('Element not found')
          }
        } else {
          const error: Error | undefined = this.errors.missingSegmentStart(
            this.segment,
            this.throwOnMissingDefinitions,
          )
          if (error) {
            throw error
          }
          return
        }

        // We perform validation if either the required component count is greater than
        // or equal to the current component count or if a non-empty value was found
        if (this.required >= this.counts.component || length > 0) {
          if (length < this.minimum) {
            throw this.errors.invalidData(
              this.element,
              `'${buffer?.content()}' length is less than minimum length ${
                this.minimum
              }`,
            )
          }
          if (length > this.maximum) {
            throw this.errors.invalidData(
              this.element,
              `'${buffer?.content()}' exceeds maximum length ${this.maximum}`,
            )
          }
        }
    }
    return currentComponent
  }

  /**
   * @summary Finish validation for the current segment.
   */
  onCloseSegment(segment: string): void {
    switch (this.state) {
      // biome-ignore lint/suspicious/noFallthroughSwitchClause: Needed
      case ValidatorStates.ALL:
        if (this.segment === undefined) {
          const error: Error | undefined = this.errors.missingSegmentStart(
            segment,
            this.throwOnMissingDefinitions,
          )
          if (error) {
            throw error
          }
          return
        }
        if (this.element === undefined) {
          throw this.errors.missingElementStart(segment)
        }

        if (
          this.counts.component < this.element.requires ||
          this.counts.component > this.element.components.length
        ) {
          throw this.errors.countError(
            'Element',
            this.segment.elements[this.counts.element].id,
            this.element,
            this.counts.component,
          )
        }
      // Fall through to continue with element cound validation
      case ValidatorStates.ELEMENTS:
        if (this.segment === undefined) {
          const error: Error | undefined = this.errors.missingSegmentStart(
            segment,
            this.throwOnMissingDefinitions,
          )
          if (error) {
            throw error
          }
          return
        }

        if (
          this.counts.element < this.segment.requires ||
          this.counts.element > this.segment.elements.length
        ) {
          throw this.errors.countError(
            'Segment',
            segment,
            this.segment,
            this.counts.element,
          )
        }
    }
  }

  private errors = {
    invalidData: (element: ElementEntry | undefined, msg: string): Error =>
      new Error(
        `Could not accept data on element ${
          element?.id || 'undefined'
        }: ${msg}`,
      ),
    invalidFormatString: (formatString: string): Error =>
      new Error(`Invalid format string ${formatString}`),
    countError: (
      type: string,
      name: string,
      definition: ElementEntry | SegmentEntry,
      count: number,
    ): Error => {
      let array: string
      let start = `${type} ${name}`
      let end: string

      let length = 0
      if (type === 'Segment') {
        array = 'elements'
        const entry: SegmentEntry = definition as SegmentEntry
        length = entry.elements.length
      } else {
        array = 'components'
        const entry: ElementEntry = definition as ElementEntry
        length = entry.components.length
      }

      if (count < definition.requires) {
        start += ' only'
        end = ` but requires at least ${definition.requires}`
      } else {
        end = ` but accepts at most ${length}`
      }
      return new Error(
        `${start} got ${count} ${array}${end}${JSON.stringify(definition)}`,
      )
    },
    missingElementStart: (segment: string): Error => {
      const message = `Active open element expected on segment ${segment}`
      return new Error(message)
    },
    missingElementDefinition: (element: string, segment?: string): Error => {
      const message = `No definition found for element ${element}${segment ? ` on segment ${segment}` : ''}`
      return new Error(message)
    },
    missingSegmentStart: (
      segment?: string,
      throwOnMissingDefinitions?: boolean,
    ): Error | undefined => {
      if (!throwOnMissingDefinitions) {
        return undefined
      }

      let name: string
      if (segment) {
        name = `'${segment}'`
      } else {
        name = "''"
      }
      return new Error(`Active open segment ${name} expected. Found none`)
    },
    missingSegmentDefinition: (
      segment: string,
      throwOnMissingDefinitions?: boolean,
    ): Error | undefined => {
      if (throwOnMissingDefinitions) {
        return new Error(
          `No segment definition found for segment name ${segment}`,
        )
      }
      console.warn(`No segment definition found for segment name ${segment}`)
      return undefined
    },
  }
}
