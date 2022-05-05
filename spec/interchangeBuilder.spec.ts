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

// import { ResultType } from '../src/reader';
import { InterchangeBuilder } from '../src/interchangeBuilder';
import { Separators, EdifactSeparatorsBuilder } from '../src/edi/separators';
import { Reader, ResultType } from '../src';

describe('InterchangeBuilder', () => {
    // let parseResult: ResultType[];
    const separators: Separators = new EdifactSeparatorsBuilder().build();

    // beforeEach(() => {
    //     parseResult = [
    //         {
    //             name: 'UNB',
    //             elements: [
    //                 {
    //                     components: [
    //                         'UNOA',
    //                         '1',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         '',
    //                         ''
    //                     ],
    //                     id: 'S001',
    //                     requires: 1
    //                 },
    //                 { components: ['005435656', '1'], id: 'S002', requires: 1 },
    //                 { components: ['006415160', '1'], id: 'S003', requires: 1 },
    //                 { components: ['060515', '1434'], id: 'S004', requires: 1 },
    //                 { components: ['00000000000778'], id: '0020', requires: 1 }
    //             ]
    //         },
    //         {
    //             name: 'UNH',
    //             elements: [
    //                 { components: ['00000000000117'], id: '0062', requires: 1 },
    //                 {
    //                     components: ['INVOIC', 'D', '01B', 'UN'],
    //                     id: 'S009',
    //                     requires: 1
    //                 }
    //             ]
    //         },
    //         {
    //             name: 'BGM',
    //             elements: [
    //                 { components: ['380'], id: 'C002', requires: 1 },
    //                 { components: ['342459'], id: 'C106', requires: 1 },
    //                 { components: ['9'], id: '1225', requires: 1 }
    //             ]
    //         },
    //         {
    //             name: 'DTM',
    //             elements: [['3', '20060515', '102']]
    //         },
    //         // added for demonstration purpose that the interchange builder values the respective spec
    //         {
    //             name: 'GIR',
    //             elements: [['3'], ['00999100', 'ML']]
    //         },
    //         {
    //             name: 'RFF',
    //             elements: [['ON', '521052']]
    //         },
    //         {
    //             name: 'NAD',
    //             elements: [
    //                 ['BY'],
    //                 ['792820524', '', '16'],
    //                 [''],
    //                 ['CUMMINS MID-RANGE ENGINE PLANT']
    //             ]
    //         },
    //         {
    //             name: 'NAD',
    //             elements: [
    //                 ['SE'],
    //                 ['005435656', '', '16'],
    //                 [''],
    //                 ['GENERAL WIDGET COMPANY']
    //             ]
    //         },
    //         {
    //             name: 'CUX',
    //             elements: [['1', 'USD']]
    //         },
    //         {
    //             name: 'LIN',
    //             elements: [['1'], [''], ['157870', 'IN']]
    //         },
    //         {
    //             name: 'IMD',
    //             elements: [['F'], [''], ['', '', '', 'WIDGET']]
    //         },
    //         {
    //             name: 'QTY',
    //             elements: [['47', '1020', 'EA']]
    //         },
    //         {
    //             name: 'ALI',
    //             elements: [['US']]
    //         },
    //         {
    //             name: 'MOA',
    //             elements: [['203', '1202.58']]
    //         },
    //         {
    //             name: 'PRI',
    //             elements: [['INV', '1.179']]
    //         },
    //         {
    //             name: 'LIN',
    //             elements: [['2'], [''], ['157871', 'IN']]
    //         },
    //         {
    //             name: 'IMD',
    //             elements: [['F'], [''], ['', '', '', 'DIFFERENT WIDGET']]
    //         },
    //         {
    //             name: 'QTY',
    //             elements: [['47', '20', 'EA']]
    //         },
    //         {
    //             name: 'ALI',
    //             elements: [['JP']]
    //         },
    //         {
    //             name: 'MOA',
    //             elements: [['203', '410']]
    //         },
    //         {
    //             name: 'PRI',
    //             elements: [['INV', '20.5']]
    //         },
    //         {
    //             name: 'UNS',
    //             elements: [['S']]
    //         },
    //         {
    //             name: 'MOA',
    //             elements: [['39', '2137.58']]
    //         },
    //         {
    //             name: 'ALC',
    //             elements: [['C'], ['ABG']]
    //         },
    //         {
    //             name: 'MOA',
    //             elements: [['8', '525']]
    //         },
    //         {
    //             name: 'UNT',
    //             elements: [['23'], ['00000000000117']]
    //         },
    //         // 2nd message
    //         {
    //             name: 'UNH',
    //             elements: [['00000000000118'], ['INVOIC', 'D', '01B', 'UN']]
    //         },
    //         {
    //             name: 'BGM',
    //             elements: [['380'], ['342459'], ['9']]
    //         },
    //         {
    //             name: 'DTM',
    //             elements: [['3', '20060515', '102']]
    //         },
    //         // added for demonstration purpose that the interchange builder values the respective spec
    //         {
    //             name: 'GIR',
    //             elements: [['3'], ['00999100', 'ML']]
    //         },
    //         {
    //             name: 'RFF',
    //             elements: [['ON', '521052']]
    //         },
    //         {
    //             name: 'NAD',
    //             elements: [
    //                 ['BY'],
    //                 ['792820524', '', '16'],
    //                 [''],
    //                 ['CUMMINS MID-RANGE ENGINE PLANT']
    //             ]
    //         },
    //         {
    //             name: 'NAD',
    //             elements: [
    //                 ['SE'],
    //                 ['005435656', '', '16'],
    //                 [''],
    //                 ['GENERAL WIDGET COMPANY']
    //             ]
    //         },
    //         {
    //             name: 'CUX',
    //             elements: [['1', 'USD']]
    //         },
    //         {
    //             name: 'LIN',
    //             elements: [['1'], [''], ['157870', 'IN']]
    //         },
    //         {
    //             name: 'IMD',
    //             elements: [['F'], [''], ['', '', '', 'WIDGET']]
    //         },
    //         {
    //             name: 'QTY',
    //             elements: [['47', '1020', 'EA']]
    //         },
    //         {
    //             name: 'ALI',
    //             elements: [['US']]
    //         },
    //         {
    //             name: 'MOA',
    //             elements: [['203', '1202.58']]
    //         },
    //         {
    //             name: 'PRI',
    //             elements: [['INV', '1.179']]
    //         },
    //         {
    //             name: 'LIN',
    //             elements: [['2'], [''], ['157871', 'IN']]
    //         },
    //         {
    //             name: 'IMD',
    //             elements: [['F'], [''], ['', '', '', 'DIFFERENT WIDGET']]
    //         },
    //         {
    //             name: 'QTY',
    //             elements: [['47', '20', 'EA']]
    //         },
    //         {
    //             name: 'ALI',
    //             elements: [['JP']]
    //         },
    //         {
    //             name: 'MOA',
    //             elements: [['203', '410']]
    //         },
    //         {
    //             name: 'PRI',
    //             elements: [['INV', '20.5']]
    //         },
    //         {
    //             name: 'UNS',
    //             elements: [['S']]
    //         },
    //         {
    //             name: 'MOA',
    //             elements: [['39', '2137.58']]
    //         },
    //         {
    //             name: 'ALC',
    //             elements: [['C'], ['ABG']]
    //         },
    //         {
    //             name: 'MOA',
    //             elements: [['8', '525']]
    //         },
    //         {
    //             name: 'UNT',
    //             elements: [['23'], ['00000000000118']]
    //         },
    //         {
    //             name: 'UNZ',
    //             elements: [['2'], ['00000000000778']]
    //         }
    //     ];
    // });

    it("shouldn't accept empty parse result as input", () => {
        expect(
            () => new InterchangeBuilder([], separators, 'src/messageSpec/')
        ).toThrow();
    });

    it('should format results correctly (getFormattedResults)', () => {
        const sut: Reader = new Reader('./src/messageSpec');

        let document = '';
        document += "UNA:+,? '";
        document +=
            "UNB+UNOA:1+005435656:1+006415160:1+060515:1434+00000000000778'";
        document += "UNH+00000000000117+INVOIC:D:01B:UN'";
        document += "BGM+380+342459+9'";
        document += "DTM+3:20060515:102'";
        document += "RFF+ON:521052'";
        document += "NAD+BY+792820524::16++CUMMINS MID-RANGE ENGINE PLANT'";
        document += "NAD+SE+005435656::16++GENERAL WIDGET COMPANY'";
        document += "CUX+1:USD'";
        document += "LIN+1++157870:IN'";
        document += "IMD+F++:::WIDGET'";
        document += "QTY+47:1020:EA'";
        document += "ALI+US'";
        document += "MOA+203:1202,58'";
        document += "PRI+INV:1,179'";
        document += "LIN+2++157871:IN'";
        document += "IMD+F++:::DIFFERENT WIDGET'";
        document += "QTY+47:20:EA'";
        document += "ALI+JP'";
        document += "MOA+203:410'";
        document += "PRI+INV:20,5'";
        document += "UNS+S'";
        document += "MOA+39:2137,58'";
        document += "ALC+C+ABG'";
        document += "MOA+8:525'";
        document += "UNT+23+00000000000117'";
        document += "UNZ+1+00000000000778'";

        const parsingResult: ResultType[] = sut.parse(document);

        // Get the interchange
        const interchangeBuilder = new InterchangeBuilder(
            parsingResult,
            sut.separators,
            './src/messageSpec'
        );

        // Should have exactly one message
        expect(interchangeBuilder.interchange.messages.length === 1);
        // const message = interchangeBuilder.interchange.messages[0];
    });

    it('should read singleline documents correctly', () => {
        const document = `UNA:+.? 'UNB+UNOC:3+91100:ZZ:PRODAT+92015:ZZ+220223:2014+E220223842164++27-DDQ-PRODAT'UNH+1+APERAK:D:96A:UN:E2SE6B'BGM+++34'DTM+137:202202232014:203'DTM+178:202202232012:203'RFF+ACW:E223201218334'NAD+FR+91100:160:SVK+++++++SE'NAD+DO+92015:160:SVK+++++++SE'ERC+100::260'FTX+AAO+++OK'RFF+Z07:ANLID-10120'RFF+LI:ANLID-10120'UNT+12+1'UNZ+1+E220223842164'`;

        const sut: Reader = new Reader('./src/messageSpec');
        const results = sut.parse(document);
        const interchange = new InterchangeBuilder(
            results,
            sut.separators,
            './src/messageSpec'
        ).interchange;
        console.log(interchange.messages[0]);
    });

    // it('should build D01B interchange correctly', () => {
    //     const builder: InterchangeBuilder = new InterchangeBuilder(
    //         parseResult,
    //         separators,
    //         'src/messageSpec/'
    //     );
    //     const edi: Edifact = builder.interchange;
    //     expect(edi).toBeDefined();
    //     expect(edi.messages.length).toEqual(2);

    //     // expected 1 group holding two 2 subgroups with LIN, IMD, QTY, ALI and further segments
    //     expect(edi.messages[0].detail.length).toEqual(1);
    //     expect((edi.messages[0].detail[0] as Group).data.length).toEqual(2);
    //     // looking up the LIN segments by group name should also return the same result
    //     const segGroup: Group | undefined =
    //         edi.messages[0].groupByName('Segment group 26');
    //     expect(segGroup?.data.length).toEqual(2);
    //     // subgroup should contain 6 segments (LIN, IMD, QTY, ALI) or groups (MOA + PRI)
    //     const linGroup0: Group = segGroup?.data[0] as Group;
    //     expect(linGroup0.data.length).toEqual(6);

    //     expect(edi.messages[1].header.length).toEqual(
    //         edi.messages[0].header.length
    //     );
    //     expect(edi.messages[1].detail.length).toEqual(1);
    //     console.log(edi.messages[1].header[0]);
    // });

    // it('should fail D96A message structure', () => {
    //     parseResult[1].elements = [
    //         ['00000000000117'],
    //         ['INVOIC', 'D', '96A', 'UN']
    //     ];
    //     expect(
    //         () =>
    //             new InterchangeBuilder(
    //                 parseResult,
    //                 separators,
    //                 'src/messageSpec/'
    //             )
    //     ).toThrow();
    // });
});
