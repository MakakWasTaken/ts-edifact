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

export { Cache } from './cache'
export { Configuration } from './configuration'
export {
  EdifactMessageSpecification,
  UNECEMessageStructureParser,
} from './edi/messageStructureParser'
export {
  AnsiX12SeparatorsBuilder,
  EdifactSeparatorsBuilder,
  Separators,
  TradacomsSeparatorsBuilder,
} from './edi/separators'
export {
  BeginOfMessage,
  LineItem,
  MonetaryAmount,
  PriceDetails,
  Quantity,
  Segment,
  sanitizeFloat,
} from './edifact'
export {
  Edifact,
  Group,
  InterchangeBuilder,
  Message,
  RecipientsRef,
  SyntaxIdentifier,
} from './interchangeBuilder'
export { Parser } from './parser'
export { Reader, ResultType } from './reader'
export { SegmentTableBuilder } from './segments'
export { Tokenizer } from './tokenizer'
export { MessageType, Pointer, Tracker } from './tracker'
export {
  Dictionary,
  ElementEntry,
  NullValidator,
  SegmentEntry,
  Validator,
  ValidatorImpl,
  ValidatorStates,
} from './validator'

import APERAK_JSON from './messageSpec/APERAK.struct.json'
import AUTHOR_JSON from './messageSpec/AUTHOR.struct.json'
import BALANC_JSON from './messageSpec/BALANC.struct.json'
import DESADV_JSON from './messageSpec/DESADV.struct.json'
import GENRAL_JSON from './messageSpec/GENRAL.struct.json'
import IFTMIN_JSON from './messageSpec/IFTMIN.struct.json'
import INVOIC_JSON from './messageSpec/INVOIC.struct.json'
import INVRPT_JSON from './messageSpec/INVRPT.struct.json'
import ORDERS_JSON from './messageSpec/ORDERS.struct.json'
import OSTENQ_JSON from './messageSpec/OSTENQ.struct.json'
import OSTRPT_JSON from './messageSpec/OSTRPT.struct.json'
import PARTIN_JSON from './messageSpec/PARTIN.struct.json'
import TAXCON_JSON from './messageSpec/TAXCON.struct.json'
import VATDEC_JSON from './messageSpec/VATDEC.struct.json'

export const APERAK = APERAK_JSON
export const AUTHOR = AUTHOR_JSON
export const BALANC = BALANC_JSON
export const DESADV = DESADV_JSON
export const GENRAL = GENRAL_JSON
export const IFTMIN = IFTMIN_JSON
export const INVOIC = INVOIC_JSON
export const INVRPT = INVRPT_JSON
export const ORDERS = ORDERS_JSON
export const OSTENQ = OSTENQ_JSON
export const OSTRPT = OSTRPT_JSON
export const PARTIN = PARTIN_JSON
export const TAXCON = TAXCON_JSON
export const VATDEC = VATDEC_JSON
