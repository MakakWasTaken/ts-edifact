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

import * as fs from 'fs'
import { TableBuilder } from './tableBuilder'
import { Dictionary, SegmentEntry } from './validator'

export class SegmentTableBuilder extends TableBuilder<SegmentEntry> {
  constructor(type: string) {
    super(type)
  }

  static enrichWithDefaultSegments(
    data: Dictionary<SegmentEntry>,
  ): Dictionary<SegmentEntry> {
    data.add('UNB', {
      requires: 5,
      elements: [
        {
          id: 'S001',
          name: 'syntaxIdentifier',
          requires: 2,
          components: [
            { id: '0001', format: 'a4', name: 'syntaxIdentifier' },
            { id: '0002', format: 'n1', name: 'syntaxVersionNumber' },
            {
              id: '0080',
              format: 'an..6',
              name: 'serviceCodeListDirectoryVersionNumber',
            },
            { id: '0133', format: 'an..3', name: 'characterEncodingCoded' },
            { id: '0076', format: 'an2', name: 'syntaxReleaseNumber' },
          ],
        },
        {
          id: 'S002',
          name: 'interchangeSender',
          requires: 1,
          components: [
            {
              id: '0004',
              format: 'an..35',
              name: 'interchangeSenderIdentification',
            },
            {
              id: '0007',
              format: 'an..4',
              name: 'identificationCodeQualifier',
            },
            {
              id: '0008',
              format: 'an..35',
              name: 'interchangeSenderInternalIdentification',
            },
            {
              id: '0042',
              format: 'an..35',
              name: 'interchangeSenderInternalSubIdentification',
            },
          ],
        },
        {
          id: 'S003',
          name: 'interchangeRecipient',
          requires: 1,
          components: [
            {
              id: '0010',
              format: 'an..35',
              name: 'interchangeRecipientIdentification',
            },
            {
              id: '0007',
              format: 'an..4',
              name: 'identificationCodeQualifier',
            },
            {
              id: '0014',
              format: 'an..35',
              name: 'interchangeRecipientInternalIdentification',
            },
            {
              id: '0046',
              format: 'an..35',
              name: 'interchangeRecipientInternalSubIdentification',
            },
          ],
        },
        {
          id: 'S004',
          name: 'dateAndTimeOfPreparation',
          requires: 2,
          components: [
            { id: '0017', format: 'n..8', name: 'date' },
            { id: '0019', format: 'n4', name: 'time' },
          ],
        },
        {
          id: '0020',
          name: 'interchangeControlReference',
          requires: 1,
          components: [
            {
              id: '0020',
              format: 'an..14',
              name: 'interchangeControlReference',
            },
          ],
        },
        {
          id: 'S005',
          name: 'recipientReferencePasswordDetails',
          requires: 1,
          components: [
            {
              id: '0022',
              format: 'an..14',
              name: 'recipientReferencePassword',
            },
            {
              id: '0025',
              format: 'an2',
              name: 'recipientReferencePasswordQualifier',
            },
          ],
        },
        {
          id: '0026',
          name: 'applicationReference',
          requires: 0,
          components: [
            { id: '0026', format: 'an..14', name: 'applicationReference' },
          ],
        },
        {
          id: '0029',
          name: 'processingPriorityCode',
          requires: 0,
          components: [
            { id: '0029', format: 'a1', name: 'processingPriorityCode' },
          ],
        },
        {
          id: '0031',
          name: 'acknowledgementRequest',
          requires: 0,
          components: [
            { id: '0031', format: 'n1', name: 'acknowledgementRequest' },
          ],
        },
        {
          id: '0032',
          name: 'interchangeAgreementIdentifier',
          requires: 0,
          components: [
            {
              id: '0032',
              format: 'an..35',
              name: 'interchangeAgreementIdentifier',
            },
          ],
        },
        {
          id: '0035',
          name: 'testIndicator',
          requires: 0,
          components: [{ id: '0035', format: 'n1', name: 'testIndicator' }],
        },
      ],
    })
    data.add('UNH', {
      requires: 2,
      elements: [
        {
          id: '0062',
          name: 'messageReferenceNumber',
          requires: 1,
          components: [
            { id: '0062', format: 'an..14', name: 'messageReferenceNumber' },
          ],
        },
        {
          id: 'S009',
          name: 'messageIdentifier',
          requires: 4,
          components: [
            { id: '0065', format: 'an..6', name: 'messageType' },
            { id: '0052', format: 'an..3', name: 'messageVersionNumber' },
            { id: '0054', format: 'an..3', name: 'messageReleaseNumber' },
            { id: '0051', format: 'an..3', name: 'controllingAgencyCoded' },
            { id: '0057', format: 'an..6', name: 'associationAssignedCode' },
            {
              id: '0110',
              format: 'an..6',
              name: 'codeListDirectoryVersionNumber',
            },
            {
              id: '0113',
              format: 'an..6',
              name: 'messageTypeSubfunctionIdentification',
            },
          ],
        },
        {
          id: '0068',
          name: 'commonAccessReference',
          requires: 0,
          components: [
            { id: '0068', format: 'an..35', name: 'commonAccessReference' },
          ],
        },
        {
          id: 'S010',
          name: 'statusOfTheTransfer',
          requires: 1,
          components: [
            { id: '0070', format: 'n..2', name: 'sequenceOfTransfers' },
            { id: '0073', format: 'a1', name: 'firstAndLastTransfer' },
          ],
        },
        {
          id: 'S016',
          name: 'messageSubsetIdentification',
          requires: 1,
          components: [
            {
              id: '0115',
              format: 'an..14',
              name: 'messageSubsetIdentification',
            },
            { id: '0116', format: 'an..3', name: 'messageSubsetVersionNumber' },
            { id: '0118', format: 'an..3', name: 'messageSubsetReleaseNumber' },
            { id: '0051', format: 'an..3', name: 'controllingAgencyCoded' },
          ],
        },
        {
          id: 'S017',
          name: 'messageImplementationGuidelineIdentification',
          requires: 1,
          components: [
            {
              id: '0121',
              format: 'an..14',
              name: 'messageImplementationGuidelineIdentification',
            },
            {
              id: '0122',
              format: 'an..3',
              name: 'messageImplementationGuidelineVersionNumber',
            },
            {
              id: '0124',
              format: 'an..3',
              name: 'messageImplementationGuidelineReleaseNumber',
            },
            { id: '0051', format: 'an..3', name: 'controllingAgencyCoded' },
          ],
        },
        {
          id: 'S018',
          name: 'scenarioIdentification',
          requires: 1,
          components: [
            { id: '0127', format: 'an..14', name: 'scenarioIdentification' },
            { id: '0128', format: 'an..3', name: 'scenarioVersionNumber' },
            { id: '0130', format: 'an..3', name: 'scenarioReleaseNumber' },
            { id: '0051', format: 'an..3', name: 'controllingAgencyCoded' },
          ],
        },
      ],
    })
    data.add('UNS', {
      requires: 1,
      elements: [
        {
          id: '0081',
          name: 'sectionIdentification',
          requires: 1,
          components: [
            { id: '0081', format: 'a1', name: 'sectionIdentification' },
          ],
        },
      ],
    })
    data.add('UNT', {
      requires: 2,
      elements: [
        {
          id: '0074',
          name: 'numberOfSegmentsInAMessage',
          requires: 1,
          components: [
            { id: '0074', format: 'n..10', name: 'numberOfSegmentsInAMessage' },
          ],
        },
        {
          id: '0062',
          name: 'messageReferenceNumber',
          requires: 1,
          components: [
            { id: '0062', format: 'an..14', name: 'messageReferenceNumber' },
          ],
        },
      ],
    })
    data.add('UNZ', {
      requires: 2,
      elements: [
        {
          id: '0036',
          name: 'interchangeControlCount',
          requires: 1,
          components: [
            { id: '0036', format: 'n..6', name: 'interchangeControlCount' },
          ],
        },
        {
          id: '0020',
          name: 'interchangeControlReference',
          requires: 1,
          components: [
            {
              id: '0020',
              format: 'an..14',
              name: 'interchangeControlReference',
            },
          ],
        },
      ],
    })

    return data
  }

  build(): Dictionary<SegmentEntry> {
    const fileLoc: string | undefined = this.getDefinitionFileLoc('segments')
    let dict: Dictionary<SegmentEntry>

    if (fileLoc) {
      const sData: string = fs.readFileSync(fileLoc, {
        encoding: 'utf-8',
      })
      const data: { [key: string]: SegmentEntry } = JSON.parse(sData) as {
        [key: string]: SegmentEntry
      }

      dict = new Dictionary<SegmentEntry>(data)
    } else {
      dict = new Dictionary<SegmentEntry>()
    }

    return SegmentTableBuilder.enrichWithDefaultSegments(dict)
  }
}
