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
            { format: 'a4', name: 'syntaxIdentifier' },
            { format: 'n1', name: 'syntaxVersionNumber' },
            {
              format: 'an..6',
              name: 'serviceCodeListDirectoryVersionNumber',
            },
            { format: 'an..3', name: 'characterEncodingCoded' },
          ],
        },
        {
          id: 'S002',
          name: 'interchangeSender',
          requires: 1,
          components: [
            {
              format: 'an..35',
              name: 'interchangeSenderIdentification',
            },
            {
              format: 'an..4',
              name: 'identificationCodeQualifier',
            },
            {
              format: 'an..35',
              name: 'interchangeSenderInternalIdentification',
            },
            {
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
              format: 'an..35',
              name: 'interchangeRecipientIdentification',
            },
            {
              format: 'an..4',
              name: 'identificationCodeQualifier',
            },
            {
              format: 'an..35',
              name: 'interchangeRecipientInternalIdentification',
            },
            {
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
            { format: 'n..8', name: 'date' },
            { format: 'n4', name: 'time' },
          ],
        },
        {
          id: '0020',
          name: 'interchangeControlReference',
          requires: 1,
          components: [
            {
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
              format: 'an..14',
              name: 'recipientReferencePassword',
            },
            {
              format: 'an2',
              name: 'recipientReferencePasswordQualifier',
            },
          ],
        },
        {
          id: '0026',
          name: 'applicationReference',
          requires: 0,
          components: [{ format: 'an..14', name: 'applicationReference' }],
        },
        {
          id: '0029',
          name: 'processingPriorityCode',
          requires: 0,
          components: [{ format: 'a1', name: 'processingPriorityCode' }],
        },
        {
          id: '0031',
          name: 'acknowledgementRequest',
          requires: 0,
          components: [{ format: 'n1', name: 'acknowledgementRequest' }],
        },
        {
          id: '0032',
          name: 'interchangeAgreementIdentifier',
          requires: 0,
          components: [
            {
              format: 'an..35',
              name: 'interchangeAgreementIdentifier',
            },
          ],
        },
        {
          id: '0035',
          name: 'testIndicator',
          requires: 0,
          components: [{ format: 'n1', name: 'testIndicator' }],
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
          components: [{ format: 'an..14', name: 'messageReferenceNumber' }],
        },
        {
          id: 'S009',
          name: 'messageIdentifier',
          requires: 4,
          components: [
            { format: 'an..6', name: 'messageType' },
            { format: 'an..3', name: 'messageVersionNumber' },
            { format: 'an..3', name: 'messageReleaseNumber' },
            { format: 'an..3', name: 'controllingAgencyCoded' },
            { format: 'an..6', name: 'associationAssignedCode' },
            {
              format: 'an..6',
              name: 'codeListDirectoryVersionNumber',
            },
            {
              format: 'an..6',
              name: 'messageTypeSubfunctionIdentification',
            },
          ],
        },
        {
          id: '0068',
          name: 'commonAccessReference',
          requires: 0,
          components: [{ format: 'an..35', name: 'commonAccessReference' }],
        },
        {
          id: 'S010',
          name: 'statusOfTheTransfer',
          requires: 1,
          components: [
            { format: 'n..2', name: 'sequenceOfTransfers' },
            { format: 'a1', name: 'firstAndLastTransfer' },
          ],
        },
        {
          id: 'S016',
          name: 'messageSubsetIdentification',
          requires: 1,
          components: [
            {
              format: 'an..14',
              name: 'messageSubsetIdentification',
            },
            { format: 'an..3', name: 'messageSubsetVersionNumber' },
            { format: 'an..3', name: 'messageSubsetReleaseNumber' },
            { format: 'an..3', name: 'controllingAgencyCoded' },
          ],
        },
        {
          id: 'S017',
          name: 'messageImplementationGuidelineIdentification',
          requires: 1,
          components: [
            {
              format: 'an..14',
              name: 'messageImplementationGuidelineIdentification',
            },
            {
              format: 'an..3',
              name: 'messageImplementationGuidelineVersionNumber',
            },
            {
              format: 'an..3',
              name: 'messageImplementationGuidelineReleaseNumber',
            },
            { format: 'an..3', name: 'controllingAgencyCoded' },
          ],
        },
        {
          id: 'S018',
          name: 'scenarioIdentification',
          requires: 1,
          components: [
            { format: 'an..14', name: 'scenarioIdentification' },
            { format: 'an..3', name: 'scenarioVersionNumber' },
            { format: 'an..3', name: 'scenarioReleaseNumber' },
            { format: 'an..3', name: 'controllingAgencyCoded' },
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
          components: [{ format: 'a1', name: 'sectionIdentification' }],
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
          components: [{ format: 'n..10', name: 'numberOfSegmentsInAMessage' }],
        },
        {
          id: '0062',
          name: 'messageReferenceNumber',
          requires: 1,
          components: [{ format: 'an..14', name: 'messageReferenceNumber' }],
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
          components: [{ format: 'n..6', name: 'interchangeControlCount' }],
        },
        {
          id: '0020',
          name: 'interchangeControlReference',
          requires: 1,
          components: [
            {
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
    const fileLoc: string | undefined = this.getDefinitionFileLoc()
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
