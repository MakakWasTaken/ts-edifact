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

import { Parser } from './parser';
import {
    Validator,
    Dictionary,
    SegmentEntry,
    ValidatorImpl,
    ElementEntry,
    Component
} from './validator';

import { SegmentTableBuilder } from './segments';
import { Separators } from './edi/separators';
import { findElement, isDefined } from './util';
import { Cache } from './cache';
import { Configuration } from './configuration';

export type ResultType = {
    name: string;
    elements: ElementEntry[];
};

export type Result = {
    name: string;
    elements: ResultElement[];
};

export type ResultElement = {
    name: string;
    components: ResultComponents;
};

export type ResultComponents = {
    [key: string]: string | undefined;
};

/**
 * The `Reader` class is included for backwards compatibility. It translates an
 * UN/EDIFACT document to an array of segments. Each segment has a `name` and
 * `elements` property where `elements` is an array consisting of component
 * arrays. The class exposes a `parse()` method which accepts the document as a
 * string.
 */
export class Reader {
    private result: ResultType[];
    private elements: ElementEntry[];
    private element: ElementEntry | undefined;

    private validator: Validator;
    private parser: Parser;

    private defined = false;
    private validationTables: Dictionary<SegmentEntry>[] = [];

    private definitionCache: Cache<Dictionary<SegmentEntry>> = new Cache(15);
    private unbCharsetDefined = false;

    separators: Separators;

    constructor(messageSpecDir?: string) {
        const config: Configuration = new Configuration({
            validator: new ValidatorImpl()
        });
        this.parser = new Parser(config);
        this.validator = config.validator;

        // Holds the results
        this.result = [];

        // Holds the elements
        this.elements = [];
        let components: Component[] = [];

        // Holds the temporary element components.
        let componentIndex = 0;

        let activeSegment: { id: string; segmentEntry: SegmentEntry } | null;

        // When a new segment is opened, reset all things element and set the current segment
        this.parser.onOpenSegment = (
            segment: string,
            segmentEntry: SegmentEntry | undefined
        ): void => {
            this.elements = [];
            this.element = undefined;
            // Set the currently active segments
            activeSegment = segmentEntry
                ? { id: segment, segmentEntry: segmentEntry }
                : null;
        };
        this.parser.onElement = (
            newElement: ElementEntry | undefined
        ): void => {
            // Add the previous element
            if (this.element) {
                this.elements.push({ ...this.element, components });
            }
            // Set the current element
            this.element = newElement;
            // Reset component values
            components = [];
            componentIndex = 0;
        };
        this.parser.onComponent = (value: string): void => {
            if (activeSegment?.id === 'UNB' && !this.unbCharsetDefined) {
                this.parser.updateCharset(value);
                this.unbCharsetDefined = true;
            }
            // Replace value at index with correct one
            if (this.element) {
                const component = this.element.components[componentIndex];
                components.push({ ...component, value });
                componentIndex++;
            }
        };
        this.parser.onCloseSegment = (): void => {
            if (isDefined(activeSegment)) {
                if (this.element) {
                    // Add the final element, when a segment ends (Prevents the final element from missing)
                    this.elements.push({ ...this.element, components });
                }
                // Update the respective segment and element definitions once we know the exact version
                // of the document
                if (activeSegment.id === 'UNH') {
                    const messageIdentifier = findElement(
                        this.elements,
                        'S009'
                    )!.components;
                    const messageType: string = messageIdentifier[0]!.value!;
                    const messageVersion: string = messageIdentifier[1]!.value!;
                    const messageRelease: string = messageIdentifier[2]!.value!;

                    const key: string =
                        messageVersion + messageRelease + '_' + messageType;
                    if (this.definitionCache.contains(key)) {
                        const segmentTable: Dictionary<SegmentEntry> =
                            this.definitionCache.get(key);
                        this.validator.define(segmentTable);
                    } else {
                        let segmentTableBuilder: SegmentTableBuilder =
                            new SegmentTableBuilder(messageType);
                        const version: string = (
                            messageVersion + messageRelease
                        ).toUpperCase();
                        segmentTableBuilder = segmentTableBuilder.forVersion(
                            version
                        ) as SegmentTableBuilder;

                        if (messageSpecDir) {
                            segmentTableBuilder =
                                segmentTableBuilder.specLocation(
                                    messageSpecDir
                                );
                        } else {
                            segmentTableBuilder =
                                segmentTableBuilder.specLocation('./');
                        }
                        const segmentTable: Dictionary<SegmentEntry> =
                            segmentTableBuilder.build();
                        this.validator.define(segmentTable);
                        this.definitionCache.insert(key, segmentTable);
                    }
                }
                // Add the current elements to the results array
                this.result.push({
                    name: activeSegment.id,
                    elements: this.elements
                });
                activeSegment = null;
            }
        };

        // will initialize default separators
        this.separators = this.parser.separators();
    }

    /**
     * Provide the underlying `Validator` with segment or element definitions.
     *
     * @summary Define segment and element structures.
     * @param definitions An object containing the definitions.
     */
    define(definitions: Dictionary<SegmentEntry>): void {
        this.validator.define(definitions);
    }

    private initializeIfNeeded(): void {
        if (!this.defined) {
            if (this.validationTables.length > 0) {
                for (const table of this.validationTables) {
                    this.validator.define(table);
                }
            } else {
                // basic Edifact envelop validation, i.e. UNB, UNH, UNS and UNZ
                this.validator.define(
                    SegmentTableBuilder.enrichWithDefaultSegments(
                        new Dictionary<SegmentEntry>()
                    )
                );
            }
            this.defined = true;
        }
    }

    parse(document: string): ResultType[] {
        this.initializeIfNeeded();

        this.result = [];

        this.parser.write(document);
        this.parser.end();
        // update separators in case the document contained a UNA header
        // with custom separators
        this.separators = this.parser.separators();

        return this.result;
    }
}
