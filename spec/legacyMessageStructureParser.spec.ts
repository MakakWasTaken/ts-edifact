/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * @author Stefan Partheymüller
 * @copyright 2021 Stefan Partheymüller
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
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { UNECELegacyMessageStructureParser } from '../src/edi/legacyMessageStructureParser'
import {
  type EdifactMessageSpecification,
  EdifactMessageSpecificationImpl,
} from '../src/edi/messageStructureParser'
import type { MessageType } from '../src/tracker'
import { findElement } from '../src/util'
import type { Dictionary, SegmentEntry } from '../src/validator'

const D99A_INVOIC_METADATA_PAGE = `
<HTML><PRE><body bgcolor=ffffff><TITLE>UNTDID - D.99A - Message INVOIC</title>
<! --- This document was created by Viorel Iordache - UN/ECE ----->
                              UN/EDIFACT

                UNITED NATIONS STANDARD MESSAGE (UNSM)

                            <B>Invoice message</B>


                                            Message Type : <B>INVOIC</B>
                                            Version      : D
                                            Release      : 99A
                                            Contr. Agency: UN

                                            Revision     : 10
                                            Date         : 99-01-14

SOURCE: Joint Rapporteurs Message Design Group JM2



                               <B>CONTENTS</B>

0.   <A HREF="invoic_d.htm#INTRODUCTION">INTRODUCTION</A>

1.   <A HREF="invoic_d.htm#SCOPE">SCOPE</A>

     1.1   <A HREF="invoic_d.htm#FUNDEF">Functional definition</A>
     1.2   <A HREF="invoic_d.htm#FOA">Field of application</A>
     1.3   <A HREF="invoic_d.htm#PRINCIP">Principles</A>

2.   <A HREF="invoic_d.htm#REF">REFERENCES</A>

3.   <A HREF="invoic_d.htm#TAD">TERMS AND DEFINITIONS</A>

     3.1   <A HREF="invoic_d.htm#TAD1">Standard terms and definitions</A>

4.   <A HREF="invoic_d.htm#MESDEF">MESSAGE DEFINITION</A>

     4.1   <A HREF="invoic_d.htm#DSC">Data segment clarification</A>
           4.1.1 <A HREF="invoic_d.htm#HS">Header section</A>
           4.1.2 <A HREF="invoic_d.htm#DS">Detail section</A>
           4.1.3 <A HREF="invoic_d.htm#SS">Summary section</A>
     4.2   <A HREF="invoic_d.htm#DSGI">Data segment index</A>(alphabetical sequence)
     4.3   <A HREF="invoic_s.htm">Message structure</A>
           4.3.1 <A HREF="invoic_s.htm">Segment table</A>
<A HREF="stand_1.htm">Standard text</A>
<hr>

</html>
`

const D99A_INVOIC_STRUCTURE_PAGE: string = readFileSync(
  join(__dirname, 'data', 'd99a_invoic_s.html'),
  'utf-8',
)
const D99A_APERAK_STRUCTURE_PAGE: string = readFileSync(
  join(__dirname, 'data', 'd99a_aperak_s.html'),
  'utf-8',
)
const D96A_ORDERS_STRUCTURE_PAGE: string = readFileSync(
  join(__dirname, 'data', 'd96a_orders_s.html'),
  'utf-8',
)

describe('UNECELegacyMessageStructureParser', () => {
  let sut: UNECELegacyMessageStructureParser

  const expectedBGMEntry: MessageType = {
    content: 'BGM',
    mandatory: true,
    repetition: 1,
    data: undefined,
    section: 'header',
  }

  const expectedSegmentGroup27Entry: MessageType = {
    name: 'Segment group 27',
    content: [
      {
        content: 'MOA',
        mandatory: true,
        repetition: 1,
        data: undefined,
        section: undefined,
      },
      {
        content: 'CUX',
        mandatory: false,
        repetition: 1,
        data: undefined,
        section: undefined,
      },
    ],
    mandatory: false,
    repetition: 99,
    data: undefined,
    section: undefined,
  }

  const expectedUNSEntry: MessageType = {
    content: 'UNS',
    mandatory: true,
    repetition: 1,
    data: undefined,
    section: 'summary',
  }

  beforeAll(() => {
    sut = new UNECELegacyMessageStructureParser('D99A', 'INVOIC')
  })

  describe('parseMetaDataPage', () => {
    it('should extract meta data correctly from D99A INVOIC meta data page', () => {
      const expectedSpec: EdifactMessageSpecificationImpl =
        new EdifactMessageSpecificationImpl('INVOIC', 'D', '99A', 'UN')

      const spec: EdifactMessageSpecificationImpl = (
        sut as any
      ).parseMetaDataPage(D99A_INVOIC_METADATA_PAGE)
      expect(spec).toEqual(expectedSpec)
    })
  })

  describe('parseStructurePage', () => {
    it('should extract message structure correctly from D99A INVOIC structure page', () => {
      const expectedSegmentNames: string[] = [
        'BGM',
        'DTM',
        'PAI',
        'ALI',
        'IMD',
        'FTX',
        'LOC',
        'GIS',
        'DGS',
        'RFF',
        'GIR',
        'MEA',
        'QTY',
        'MOA',
        'NAD',
        'FII',
        'DOC',
        'CTA',
        'COM',
        'TAX',
        'CUX',
        'PAT',
        'PCD',
        'TDT',
        'TSR',
        'TOD',
        'EQD',
        'SEL',
        'PAC',
        'PCI',
        'GIN',
        'ALC',
        'RNG',
        'RTE',
        'RCS',
        'AJT',
        'INP',
        'LIN',
        'PIA',
        'QVR',
        'PRI',
        'APR',
        'CNT',
      ]
      const spec: EdifactMessageSpecification =
        new EdifactMessageSpecificationImpl('INVOIC', 'D', '99A', 'UN')

      const segmentNames: string[] = sut.parseStructurePage(
        D99A_INVOIC_STRUCTURE_PAGE,
        spec,
      )

      expect(segmentNames).toEqual(expectedSegmentNames)
      expect(spec.messageStructureDefinition).toContainEqual(expectedBGMEntry)
      expect(spec.messageStructureDefinition).toContainEqual(expectedUNSEntry)
      const sg26: MessageType | undefined =
        spec.messageStructureDefinition.find(
          (item) => item.name === 'Segment group 26',
        )
      expect(sg26).toBeDefined()
      expect((sg26 as any).content).toContainEqual(expectedSegmentGroup27Entry)
    })

    it('should correctly parse D99A APERAK structure page (no header section)', () => {
      const expectedSegmentNames: string[] = [
        'BGM',
        'DTM',
        'FTX',
        'CNT',
        'DOC',
        'RFF',
        'NAD',
        'CTA',
        'COM',
        'ERC',
      ]
      const expectedBGMEntry_APERAK: MessageType = {
        ...expectedBGMEntry,
        section: undefined,
      }
      const expectedSegmentGroup5Entry: MessageType = {
        name: 'Segment group 5',
        content: [
          {
            content: 'RFF',
            mandatory: true,
            repetition: 1,
            data: undefined,
            section: undefined,
          },
          {
            content: 'FTX',
            mandatory: false,
            repetition: 9,
            data: undefined,
            section: undefined,
          },
        ],
        mandatory: false,
        repetition: 9,
        data: undefined,
        section: undefined,
      }

      const spec: EdifactMessageSpecification =
        new EdifactMessageSpecificationImpl('APERAK', 'D', '99A', 'UN')

      const segmentNames: string[] = sut.parseStructurePage(
        D99A_APERAK_STRUCTURE_PAGE,
        spec,
      )

      expect(segmentNames).toEqual(expectedSegmentNames)

      expect(spec.messageStructureDefinition).toContainEqual(
        expectedBGMEntry_APERAK,
      )
      const sg4: MessageType | undefined = spec.messageStructureDefinition.find(
        (item) => item.name === 'Segment group 4',
      )
      expect(sg4).toBeDefined()
      expect((sg4 as any).content).toContainEqual(expectedSegmentGroup5Entry)
    })

    it('should correctly parse D96A ORDERS structure page', () => {
      const spec: EdifactMessageSpecification =
        new EdifactMessageSpecificationImpl('ORDERS', 'D', '96A', 'UN')
      sut.parseStructurePage(D96A_ORDERS_STRUCTURE_PAGE, spec)

      expect(spec.messageStructureDefinition).toContainEqual({
        ...expectedBGMEntry,
        section: 'header',
      })
      expect(spec.messageStructureDefinition).toContainEqual(expectedUNSEntry)
      expect(spec.messageStructureDefinition[7]).toBeDefined()
      expect(spec.messageStructureDefinition[7].name).toBe('Segment group 1')
      expect(spec.messageStructureDefinition[8]).toBeDefined()
      expect(spec.messageStructureDefinition[8].name).toBe('Segment group 25')
      const sg25: MessageType | undefined =
        spec.messageStructureDefinition.find(
          (item) => item.name === 'Segment group 25',
        )
      expect(sg25).toBeDefined()
    })
  })

  describe('parseSegmentDefinitionPage', () => {
    it('should parse segment definition page', (done) => {
      const page = `
<HTML><title>UNTDID - D.99A - Segment MEA</title>
<! --- This document was created by Viorel Iordache - UN/ECE on 4/2/99 ----->
<pre><body bgcolor=ffffff>
    <A HREF="trsd.htm">Change indicators</A>

<HR>
        <A HREF="csegmea.htm">MEA</A>   <B>MEASUREMENTS</B>

        Function: To specify physical measurements, including dimension
                tolerances, weights and counts.

010   <A HREF="../uncl/uncl6311.htm">6311</A>  MEASUREMENT PURPOSE QUALIFIER                  M  an..3

020   <A HREF="../trcd/trcdc502.htm">C502</A>  MEASUREMENT DETAILS                            C
        <A HREF="../uncl/uncl6313.htm">6313</A>   Property measured, coded                      C  an..3
        <A HREF="../uncl/uncl6321.htm">6321</A>   Measurement significance, coded               C  an..3
        <A HREF="../uncl/uncl6155.htm">6155</A>   Measurement attribute identification          C  an..17
        <A HREF="../uncl/uncl6154.htm">6154</A>   Measurement attribute                         C  an..70

030   <A HREF="../trcd/trcdc174.htm">C174</A>  VALUE/RANGE                                    C
        <A HREF="../uncl/uncl6411.htm">6411</A>   Measure unit qualifier                        M  an..3
        <A HREF="../uncl/uncl6314.htm">6314</A>   Measurement value                             C  an..18
        <A HREF="../uncl/uncl6162.htm">6162</A>   Range minimum                                 C  n..18
        <A HREF="../uncl/uncl6152.htm">6152</A>   Range maximum                                 C  n..18
        <A HREF="../uncl/uncl6432.htm">6432</A>   Significant digits                            C  n..2

040   <A HREF="../uncl/uncl7383.htm">7383</A>  SURFACE/LAYER INDICATOR, CODED                 C  an..3

<HR>`

      const spec: EdifactMessageSpecification =
        new EdifactMessageSpecificationImpl('INVOIC', 'D', '99A', 'UN')
      ;(sut as any).parseSegmentDefinitionPage('MEA', page, spec).then(() => {
        const segments: Dictionary<SegmentEntry> = spec.segmentTable

        expect(
          segments.get('MEA')?.elements.map((element) => element.id),
        ).toEqual(expect.arrayContaining(['6311', 'C502', 'C174', '7383']))
        expect(segments.get('MEA')?.requires).toEqual(1)

        expect(
          findElement(segments.get('MEA')?.elements, '6311')?.components,
        ).toEqual(
          expect.arrayContaining([
            {
              id: '6311',
              format: 'an..3',
              name: 'measurementPurposeQualifier',
            },
          ]),
        )
        expect(
          findElement(segments.get('MEA')?.elements, '6311')?.requires,
        ).toEqual(1)
        expect(
          findElement(segments.get('MEA')?.elements, 'C174')?.components?.map(
            (c) => c.format,
          ),
        ).toEqual(
          expect.arrayContaining(['an..3', 'an..18', 'n..18', 'n..18', 'n..2']),
        )
        expect(
          findElement(segments.get('MEA')?.elements, 'C174')?.requires,
        ).toEqual(1)

        // sub-components should not be stored
        expect(
          findElement(segments.get('MEA')?.elements, '6411'),
        ).toBeUndefined()

        done()
      })
    })

    it('should add multiple element definitions only once', (done) => {
      const page = `
<HTML><title>UNTDID - D.99A - Segment CUX</title>
<! --- This document was created by Viorel Iordache - UN/ECE on 4/2/99 ----->
<pre><body bgcolor=ffffff>
    <A HREF="trsd.htm">Change indicators</A>

<HR>
        <A HREF="csegcux.htm">CUX</A>   <B>CURRENCIES</B>

        Function: To specify currencies used in the transaction and
                relevant details for the rate of exchange.

010   <A HREF="../trcd/trcdc504.htm">C504</A>  CURRENCY DETAILS                               C
        <A HREF="../uncl/uncl6347.htm">6347</A>   Currency details qualifier                    M  an..3
        <A HREF="../uncl/uncl6345.htm">6345</A>   Currency, coded                               C  an..3
        <A HREF="../uncl/uncl6343.htm">6343</A>   Currency qualifier                            C  an..3
        <A HREF="../uncl/uncl6348.htm">6348</A>   Currency rate base                            C  n..4

020   <A HREF="../trcd/trcdc504.htm">C504</A>  CURRENCY DETAILS                               C
        <A HREF="../uncl/uncl6347.htm">6347</A>   Currency details qualifier                    M  an..3
        <A HREF="../uncl/uncl6345.htm">6345</A>   Currency, coded                               C  an..3
        <A HREF="../uncl/uncl6343.htm">6343</A>   Currency qualifier                            C  an..3
        <A HREF="../uncl/uncl6348.htm">6348</A>   Currency rate base                            C  n..4

030   <A HREF="../uncl/uncl5402.htm">5402</A>  RATE OF EXCHANGE                               C  n..12

040   <A HREF="../uncl/uncl6341.htm">6341</A>  CURRENCY MARKET EXCHANGE, CODED                C  an..3

<HR>`

      const spec: EdifactMessageSpecification =
        new EdifactMessageSpecificationImpl('INVOIC', 'D', '99A', 'UN')
      ;(sut as any).parseSegmentDefinitionPage('CUX', page, spec).then(() => {
        const segments: Dictionary<SegmentEntry> = spec.segmentTable

        expect(segments.get('CUX')?.elements.map((e) => e.id)).toEqual(
          expect.arrayContaining(['C504', 'C504', '5402', '6341']),
        )
        expect(segments.get('CUX')?.requires).toEqual(0)

        expect(
          findElement(segments.get('CUX')?.elements, 'C504')?.components.length,
        ).toEqual(4)
        expect(
          findElement(segments.get('CUX')?.elements, 'C504')?.components,
        ).toEqual(
          expect.arrayContaining([
            {
              id: '6347',
              format: 'an..3',
              name: 'currencyDetailsQualifier',
            },
            {
              id: '6345',
              format: 'an..3',
              name: 'currencyCoded',
            },
            {
              id: '6343',
              format: 'an..3',
              name: 'currencyQualifier',
            },
            {
              id: '6348',
              format: 'n..4',
              name: 'currencyRateBase',
            },
          ]),
        )

        done()
      })
    })
  })

  describe('loadTypeSpec', () => {
    it('should parse remote UNECE specification', async () => {
      const spec: EdifactMessageSpecification = await sut.loadTypeSpec()
      const segments: Dictionary<SegmentEntry> = spec.segmentTable

      // check meta-data
      expect(spec.controllingAgency).toBe('UN')
      expect(spec.version).toBe('D')
      expect(spec.release).toBe('99A')
      expect(spec.messageType).toBe('INVOIC')

      // check segments
      expect(segments.get('MEA')?.elements.map((e) => e.id)).toEqual(
        expect.arrayContaining(['6311', 'C502', 'C174', '7383']),
      )
      expect(segments.get('MEA')?.requires).toEqual(1)
      expect(segments.get('CUX')?.elements.map((e) => e.id)).toEqual(
        expect.arrayContaining(['C504', 'C504', '5402', '6341']),
      )
      expect(segments.get('CUX')?.requires).toEqual(0)

      // check elements
      // elements for segment MEA
      expect(
        findElement(segments.get('MEA')?.elements, '6311')?.components,
      ).toEqual(
        expect.arrayContaining([
          { id: '6311', name: 'measurementPurposeQualifier', format: 'an..3' },
        ]),
      )
      expect(
        findElement(segments.get('MEA')?.elements, '6311')?.requires,
      ).toEqual(1)
      expect(
        findElement(segments.get('MEA')?.elements, 'C174')?.components,
      ).toEqual(
        expect.arrayContaining([
          { id: '6411', format: 'an..3', name: 'measureUnitQualifier' },
          { id: '6314', format: 'an..18', name: 'measurementValue' },
          { id: '6162', format: 'n..18', name: 'rangeMinimum' },
          { id: '6152', format: 'n..18', name: 'rangeMaximum' },
          { id: '6432', format: 'n..2', name: 'significantDigits' },
        ]),
      )
      expect(
        findElement(segments.get('MEA')?.elements, 'C174')?.requires,
      ).toEqual(1)
      // elements for segment CUX
      expect(
        findElement(segments.get('CUX')?.elements, 'C504')?.components.length,
      ).toEqual(4)
      expect(
        findElement(segments.get('CUX')?.elements, 'C504')?.components,
      ).toEqual(
        expect.arrayContaining([
          { id: '6347', format: 'an..3', name: 'currencyDetailsQualifier' },
          { id: '6345', format: 'an..3', name: 'currencyCoded' },
          { id: '6343', format: 'an..3', name: 'currencyQualifier' },
          { id: '6348', format: 'n..4', name: 'currencyRateBase' },
        ]),
      )
      // sub-components should not be stored
      expect(findElement(segments.get('MEA')?.elements, '6411')).toBeUndefined()

      // check message structure
      expect(spec.messageStructureDefinition).toContainEqual(expectedBGMEntry)
      expect(spec.messageStructureDefinition).toContainEqual(expectedUNSEntry)
      const sg26: MessageType | undefined =
        spec.messageStructureDefinition.find(
          (item) => item.name === 'Segment group 26',
        )
      expect(sg26).toBeDefined()
      expect((sg26 as any).content).toContainEqual(expectedSegmentGroup27Entry)
    })
  })
})
