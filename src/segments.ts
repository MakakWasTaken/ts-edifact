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

import { Dictionary, SegmentEntry } from './validator';
import { TableBuilder } from './tableBuilder';
import * as fs from 'fs';

export class SegmentTableBuilder extends TableBuilder<SegmentEntry> {
    constructor(type: string) {
        super(type);
    }

    static enrichWithDefaultSegments(
        data: Dictionary<SegmentEntry>
    ): Dictionary<SegmentEntry> {
        data.add('UNB', {
            requires: 5,
            elements: {
                S001: {
                    id: 'S001',
                    requires: 2,
                    components: ['a4', 'n1', 'an..6', 'an..3']
                },
                S002: {
                    id: 'S002',
                    requires: 1,
                    components: ['an..35', 'an..4', 'an..35', 'an..35']
                },
                S003: {
                    id: 'S003',
                    requires: 1,
                    components: ['an..35', 'an..4', 'an..35', 'an..35']
                },
                S004: {
                    id: 'S004',
                    requires: 2,
                    components: ['n..8', 'n4']
                },
                '0020': { id: '0020', requires: 1, components: ['an..14'] },
                S005: {
                    id: 'S005',
                    requires: 1,
                    components: ['an..14', 'an2']
                },
                '0026': { id: '0026', requires: 0, components: ['an..14'] },
                '0029': { id: '0029', requires: 0, components: ['a1'] },
                '0031': { id: '0031', requires: 0, components: ['n1'] },
                '0032': { id: '0032', requires: 0, components: ['an..35'] },
                '0035': { id: '0035', requires: 0, components: ['n1'] }
            }
        });
        data.add('UNH', {
            requires: 2,
            elements: {
                '0062': { id: '0062', requires: 1, components: ['an..14'] },
                S009: {
                    id: 'S009',
                    requires: 4,
                    components: [
                        'an..6',
                        'an..3',
                        'an..3',
                        'an..3',
                        'an..6',
                        'an..6',
                        'an..6'
                    ]
                },
                '0068': { id: '0068', requires: 0, components: ['an..35'] },
                S010: {
                    id: 'S010',
                    requires: 1,
                    components: ['n..2', 'a1']
                },
                S016: {
                    id: 'S016',
                    requires: 1,
                    components: ['an..14', 'an..3', 'an..3', 'an..3']
                },
                S017: {
                    id: 'S017',
                    requires: 1,
                    components: ['an..14', 'an..3', 'an..3', 'an..3']
                },
                S018: {
                    id: 'S018',
                    requires: 1,
                    components: ['an..14', 'an..3', 'an..3', 'an..3']
                }
            }
        });
        data.add('UNS', {
            requires: 1,
            elements: {
                '0081': { id: '0081', requires: 1, components: ['a1'] }
            }
        });
        data.add('UNT', {
            requires: 2,
            elements: {
                '0074': { id: '0074', requires: 1, components: ['n..10'] },
                '0062': { id: '0062', requires: 1, components: ['an..14'] }
            }
        });
        data.add('UNZ', {
            requires: 2,
            elements: {
                '0036': { id: '0036', requires: 1, components: ['n..6'] },
                '0020': { id: '0020', requires: 1, components: ['an..14'] }
            }
        });

        return data;
    }

    build(): Dictionary<SegmentEntry> {
        const fileLoc: string | undefined = this.getDefinitionFileLoc();
        let dict: Dictionary<SegmentEntry>;
        if (fileLoc) {
            const sData: string = fs.readFileSync(fileLoc, {
                encoding: 'utf-8'
            });
            const data: { [key: string]: SegmentEntry } = JSON.parse(sData) as {
                [key: string]: SegmentEntry;
            };

            dict = new Dictionary<SegmentEntry>(data);
        } else {
            dict = new Dictionary<SegmentEntry>();
        }

        return SegmentTableBuilder.enrichWithDefaultSegments(dict);
    }
}
