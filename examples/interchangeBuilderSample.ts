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

// Run this sample with: npx ts-node examples/interchangeBuilderSample.ts

import type { LineItem, MonetaryAmount, PriceDetails, Quantity } from '../src'
import {
  UNECEMessageStructureParser,
  type EdifactMessageSpecification,
  type MessageStructureParser,
} from '../src/edi/messageStructureParser'
import type { Separators } from '../src/edi/separators'
import type { ItemDescription } from '../src/edifact'
import {
  Group,
  InterchangeBuilder,
  type Edifact,
} from '../src/interchangeBuilder'
import { Reader, type ResultType } from '../src/reader'
import { persist } from '../src/util'

let document = ''
document += "UNB+UNOA:1+005435656:1+006415160:1+060515:1434+00000000000778'"
document += "UNH+00000000000117+INVOIC:D:01B:UN'"
document += "BGM+380+342459+9'"
document += "DTM+3:20060515:102'"
document += "RFF+ON:521052'"
document += "NAD+BY+792820524::16++CUMMINS MID-RANGE ENGINE PLANT'"
document += "NAD+SE+005435656::16++GENERAL WIDGET COMPANY'"
document += "CUX+1:USD'"
document += "LIN+1++157870:IN'" // start of detail section and first item, items (LIN and following segments) will be grouped and added to the respective item group
document += "IMD+F++:::WIDGET'"
document += "QTY+47:1020:EA'"
document += "ALI+US'"
document += "MOA+203:1202.58'"
document += "PRI+INV:1.179'"
document += "LIN+2++157871:IN'" // start 2nd item
document += "IMD+F++:::DIFFERENT WIDGET'"
document += "QTY+47:20:EA'"
document += "ALI+JP'"
document += "MOA+203:410'"
document += "PRI+INV:20.5'"
document += "UNS+S'" // start of summary section
document += "MOA+39:2137.58'"
document += "ALC+C+ABG'"
document += "MOA+8:525'"
document += "UNT+23+00000000000117'"
document += "UNZ+1+00000000000778'"

async function parseDocument(doc: string): Promise<Edifact> {
  const specDir = './'
  const specParser: MessageStructureParser = new UNECEMessageStructureParser(
    'D01B',
    'INVOIC',
  )
  const edifact: Edifact = await specParser
    .loadTypeSpec()
    .then((data: EdifactMessageSpecification) => {
      persist(data, specDir, true)
    })
    .then(() => {
      const reader: Reader = new Reader(specDir)
      const result: ResultType[] = reader.parse(doc)
      const separators: Separators = reader.separators

      const builder: InterchangeBuilder = new InterchangeBuilder(
        result,
        separators,
        specDir,
      )
      return builder.interchange
    })
    .catch((error: Error) => {
      throw error
    })
  return edifact
}

parseDocument(document)
  .then((doc: Edifact) => {
    for (const entry of (doc.messages[0].detail[0] as Group).data) {
      if (entry instanceof Group) {
        let _articleNumber: string | undefined = ''
        let _name: string | undefined = ''
        let _qty: number | undefined = 0
        let _price: number | undefined = 0
        let _total: number | undefined = 0
        for (const itemData of entry.data) {
          if (!(itemData instanceof Group)) {
            let item: ItemDescription | Quantity | LineItem | undefined
            if ((item = itemData as LineItem)) {
              _articleNumber = item.itemNumberIdentification?.itemIdentifier
            } else if ((item = itemData as ItemDescription)) {
              _name = item.itemDescription?.itemDescription
            } else if ((item = itemData as Quantity)) {
              _qty = item.quantityDetails.quantity
            }
          } else {
            for (const subGroupItem of itemData.data) {
              let item: PriceDetails | MonetaryAmount | undefined
              if ((item = subGroupItem as PriceDetails)) {
                _price = item.priceInformation?.priceAmount
              } else if ((item = subGroupItem as MonetaryAmount)) {
                _total = item.monetaryAmount?.monetaryAmount
              }
            }
          }
        }
      }
    }
  })
  .catch((error: Error) => {
    console.trace(
      `Caught exception while attempting to parse Edifact document. Reason: ${error.message}`,
    )
  })
