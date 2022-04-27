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

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
    Validator,
    ValidatorImpl,
    Dictionary,
    SegmentEntry,
    ElementEntry
} from '../src/validator';
import { Tokenizer } from '../src/tokenizer';
import { Configuration } from '../src/configuration';

describe('Validator', () => {
    let validator: Validator;

    describe('with only segment definitions', () => {
        beforeEach(() => {
            validator = new ValidatorImpl();
            const dict: Dictionary<SegmentEntry> =
                new Dictionary<SegmentEntry>();
            dict.add('AAA', {
                requires: 1,
                elements: [
                    {
                        id: 'A000',
                        requires: 1,
                        components: [
                            { format: 'a3', name: 'something1' },
                            { format: 'an3', name: 'something2' },
                            { format: 'n3', name: 'something3' }
                        ]
                    },
                    {
                        id: 'A001',
                        requires: 1,
                        components: [{ format: 'a3', name: 'something1' }]
                    }
                ]
            });
            validator.define(dict);
        });

        it("should throw if the required elements aren't provided", () => {
            const segment = 'AAA';
            validator.onOpenSegment(segment);
            expect(() => validator.onCloseSegment(segment)).toThrow();
        });

        it('should ignore segments not available in the segments definition table', () => {
            const segment = 'BBB';
            expect(() => {
                validator.onOpenSegment(segment);
                validator.onCloseSegment(segment);
            }).not.toThrow();
        });
    });

    describe('with segment and element definitions', () => {
        const buffer: Tokenizer = new Tokenizer(new Configuration());
        buffer.alpha = () => void {};
        buffer.alphanumeric = () => void {};
        buffer.numeric = () => void {};
        buffer.length = () => 0;

        beforeEach(() => {
            validator = new ValidatorImpl();
            const dict: Dictionary<SegmentEntry> =
                new Dictionary<SegmentEntry>();
            dict.add('AAA', {
                requires: 0,
                elements: [
                    {
                        id: 'A000',
                        requires: 1,
                        components: [
                            { format: 'a3', name: 'something1' },
                            { format: 'an3', name: 'something2' },
                            { format: 'n3', name: 'something3' }
                        ]
                    },
                    {
                        id: 'A001',
                        requires: 1,
                        components: [{ format: 'a3', name: 'something1' }]
                    }
                ]
            });
            validator.define(dict);
        });

        it("should throw if the required components aren't provided", () => {
            const segmentDict: Dictionary<SegmentEntry> =
                new Dictionary<SegmentEntry>();
            const dict = [
                {
                    id: 'A000',
                    requires: 1,
                    components: [{ format: 'a3', name: 'something1' }]
                }
            ];
            segmentDict.add('AAA', {
                elements: dict,
                requires: 1
            });
            validator.define(segmentDict);
            validator.onOpenSegment('AAA');
            validator.onElement();
            expect(() => validator.onElement()).toThrow();
        });

        it('should throw if too many components are provided', () => {
            const segmentDict: Dictionary<SegmentEntry> =
                new Dictionary<SegmentEntry>();
            const dict = [
                {
                    id: 'A000',
                    requires: 1,
                    components: [{ format: 'a3', name: 'something1' }]
                }
            ];
            segmentDict.add('AAA', {
                elements: dict,
                requires: 1
            });
            validator.define(segmentDict);
            validator.onOpenSegment('AAA');
            validator.onElement();
            validator.onOpenComponent(buffer);
            expect(() => {
                validator.onOpenComponent(buffer);
                validator.onElement();
            }).toThrow();
        });

        it('should ignore parsed elements with no definition available', () => {
            const segmentDict: Dictionary<SegmentEntry> =
                new Dictionary<SegmentEntry>();
            const dict = [
                {
                    id: 'A001',
                    requires: 0,
                    components: [
                        { format: 'a3', name: 'something1' },
                        { format: 'an3', name: 'something2' },
                        { format: 'n3', name: 'something3' }
                    ]
                }
            ];
            segmentDict.add('AAA', {
                elements: dict,
                requires: 1
            });
            validator.define(segmentDict);

            validator.onOpenSegment('AAA');
            expect(() => validator.onElement()).not.toThrow();
        });
    });

    describe('with actual segment and element definitions', () => {
        let validator: Validator;

        const buffer: Tokenizer = new Tokenizer(new Configuration());

        beforeEach(() => {
            // https://www.stylusstudio.com/edifact/40100/UNB_.htm
            const segments: Dictionary<SegmentEntry> =
                new Dictionary<SegmentEntry>();
            segments.add('UNB', {
                requires: 5,
                elements: [
                    {
                        id: 'S001',
                        requires: 2,
                        components: [
                            { format: 'a4', name: 'syntaxIdentifier' },
                            { format: 'n1', name: 'syntaxVersionNumber' },
                            {
                                format: 'an..6',
                                name: 'serviceCodeListDirectoryVersionNumber'
                            },
                            { format: 'an..3', name: 'characterEncodingCoded' }
                        ]
                    },
                    {
                        id: 'S002',
                        requires: 1,
                        components: [
                            {
                                format: 'an..35',
                                name: 'interchangeSenderIdentification'
                            },
                            {
                                format: 'an..4',
                                name: 'identificationCodeQualifier'
                            },
                            {
                                format: 'an..35',
                                name: 'interchangeSenderInternalIdentification'
                            },
                            {
                                format: 'an..35',
                                name: 'interchangeSenderInternalSubIdentification'
                            }
                        ]
                    },
                    {
                        id: 'S003',
                        requires: 1,
                        components: [
                            {
                                format: 'an..35',
                                name: 'interchangeRecipientIdentification'
                            },
                            {
                                format: 'an..4',
                                name: 'identificationCodeQualifier'
                            },
                            {
                                format: 'an..35',
                                name: 'interchangeRecipientInternalIdentification'
                            },
                            {
                                format: 'an..35',
                                name: 'interchangeRecipientInternalSubIdentification'
                            }
                        ]
                    },
                    {
                        id: 'S004',
                        requires: 2,
                        components: [
                            { format: 'n..8', name: 'date' },
                            { format: 'n4', name: 'time' }
                        ]
                    },
                    {
                        id: '0020',
                        requires: 1,
                        components: [
                            {
                                format: 'an..14',
                                name: 'interchangeControlReference'
                            }
                        ]
                    },
                    {
                        id: 'S005',
                        requires: 1,
                        components: [
                            {
                                format: 'an..14',
                                name: 'recipientReferencePassword'
                            },
                            {
                                format: 'an2',
                                name: 'recipientReferencePasswordQualifier'
                            }
                        ]
                    },
                    {
                        id: '0026',
                        requires: 0,
                        components: [
                            { format: 'an..14', name: 'applicationReference' }
                        ]
                    },
                    {
                        id: '0029',
                        requires: 0,
                        components: [
                            { format: 'a1', name: 'processingPriorityCode' }
                        ]
                    },
                    {
                        id: '0031',
                        requires: 0,
                        components: [
                            { format: 'n1', name: 'acknowledgementRequest' }
                        ]
                    },
                    {
                        id: '0032',
                        requires: 0,
                        components: [
                            {
                                format: 'an..35',
                                name: 'interchangeAgreementIdentifier'
                            }
                        ]
                    },
                    {
                        id: '0035',
                        requires: 0,
                        components: [{ format: 'n1', name: 'testIndicator' }]
                    }
                ]
            });

            validator = new ValidatorImpl();
            validator.define(segments);
        });

        it('should not throw on optional UNB elements', () => {
            // UNB+UNOC:3+1234567890123:14+3210987654321:14+200608:0945+KC6C2Y-U9NTGBR++++++1'
            expect(() => validator.onOpenSegment('UNB')).not.toThrow();

            // S001
            setBuffer('');
            expect(() => validator.onElement()).not.toThrow();
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('UNOC');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('3');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // S002
            expect(() => validator.onElement()).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('1234567890123');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('14');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // S003
            expect(() => validator.onElement()).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('3210987654321');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('14');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // S004
            expect(() => validator.onElement()).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('200608');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('0945');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // 0020
            expect(() => validator.onElement()).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('KC6C2Y-U9NTGBR');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // S005
            expect(() => validator.onElement()).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // 0026
            expect(() => validator.onElement()).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // 0029
            expect(() => validator.onElement()).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // 0031
            expect(() => validator.onElement()).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // 0032
            expect(() => validator.onElement()).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // 0035
            expect(() => validator.onElement()).not.toThrow();
            setBuffer('');
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer('1');
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            expect(() => validator.onCloseSegment('UNB')).not.toThrow();
        });

        function setBuffer(value: string): void {
            buffer.content = () => value;
            buffer.length = () => value.length;
        }
    });

    describe('with enabled throwOnMissingDefinitions setting', () => {
        let validator: Validator;

        describe('with only segment definitions', () => {
            beforeEach(() => {
                // note the boolean argument passed which enables strict validation, failing if an unknown segment is processed
                validator = new ValidatorImpl(true);
                const dict: Dictionary<SegmentEntry> =
                    new Dictionary<SegmentEntry>();
                dict.add('AAA', {
                    requires: 1,
                    elements: [
                        {
                            id: 'A000',
                            requires: 1,
                            components: [
                                { format: 'a3', name: 'something1' },
                                { format: 'an3', name: 'something2' },
                                { format: 'n3', name: 'something3' }
                            ]
                        },
                        {
                            id: 'A001',
                            requires: 1,
                            components: [{ format: 'a3', name: 'something1' }]
                        }
                    ]
                });
                validator.define(dict);
            });

            it('should throw on parsed segments with no definition available', () => {
                const segment = 'BBB';
                expect(() => validator.onOpenSegment(segment)).toThrow();
            });
        });

        describe('with segment and element definitions', () => {
            const buffer: Tokenizer = new Tokenizer(new Configuration());
            buffer.alpha = () => void {};
            buffer.alphanumeric = () => void {};
            buffer.numeric = () => void {};
            buffer.length = () => 0;

            beforeEach(() => {
                validator = new ValidatorImpl(true);
                const segments: Dictionary<SegmentEntry> =
                    new Dictionary<SegmentEntry>();
                segments.add('AAA', {
                    requires: 0,
                    elements: [
                        {
                            id: 'A000',
                            requires: 1,
                            components: [
                                { format: 'a3', name: 'something1' },
                                { format: 'an3', name: 'something2' },
                                { format: 'n3', name: 'something3' }
                            ]
                        },
                        {
                            id: 'A001',
                            requires: 1,
                            components: [{ format: 'a3', name: 'something1' }]
                        }
                    ]
                });

                const elements: Dictionary<ElementEntry> =
                    new Dictionary<ElementEntry>();
                elements.add('A001', {
                    id: 'A001',
                    requires: 1,
                    components: [{ format: 'a3', name: 'something1' }]
                });

                validator.define(segments);
            });

            it('should throw on parsed elements with no definition available', () => {
                const segment: Dictionary<SegmentEntry> =
                    new Dictionary<SegmentEntry>();
                segment.add('AA0', {
                    requires: 1,
                    elements: []
                });
                validator.define(segment);
                validator.onOpenSegment('AA0');
                expect(() => validator.onElement()).toThrow();
            });
        });
    });
});
