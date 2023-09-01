/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { ResultType } from './reader'
import { formatComponents } from './util'
import { ComponentValue } from './validator'

export function sanitizeFloat(str: string, decimalSymbol: string): number {
  const updatedStr: string = str.replace(decimalSymbol, '.')
  return parseFloat(updatedStr)
}

export interface Segment {
  tag: string
}

/* istanbul ignore next */
export function toSegmentObject(
  data: ResultType,
  version: string,
  decimalSeparator: string,
): Segment {
  const formattedComponents = formatComponents(
    data.elements,
    data.name,
    decimalSeparator,
  )

  switch (data.name) {
    case 'AJT':
      return formattedComponents as AdjustmentDetails
    case 'ALC':
      return formattedComponents as AllowanceOrCharge
    case 'ALI':
      return formattedComponents as AdditionalInformation
    case 'APR':
      return formattedComponents as AdditionalPriceInformation
    case 'ARD':
      return formattedComponents as MonetaryAmountFunction
    case 'AUT':
      return formattedComponents as AuthenticationResult
    case 'BGM':
      return formattedComponents as BeginOfMessage
    case 'BUS':
      return formattedComponents as BusinessFunction
    case 'CAV':
      return formattedComponents as CharacteristicValue
    case 'CCI':
      return formattedComponents as CharacteristicinterfaceID
    case 'CED':
      return formattedComponents as ComputerEnvironmentDetails
    case 'CNT':
      return formattedComponents as ControlTotal
    case 'COD':
      return formattedComponents as ComponentDetails
    case 'COM':
      return formattedComponents as CommunicationContact
    case 'CPS':
      return formattedComponents as ConsignmentPackingSequence
    case 'CTA':
      return formattedComponents as ContactInformation
    case 'CUX':
      return formattedComponents as Currencies
    case 'DGS':
      return formattedComponents as DangerousGoods
    case 'DLM':
      return formattedComponents as DeliveryLimitations
    case 'DMS':
      return formattedComponents as MessageSummary
    case 'DOC':
      return formattedComponents as MessageDetails
    case 'DTM':
      return formattedComponents as DateTimePeriod
    case 'EFI':
      return formattedComponents as ExternalFileLinkIdentification
    case 'EQA':
      return formattedComponents as AttachedEquipment
    case 'EQD':
      return formattedComponents as EquipmentDetails
    case 'ERC':
      return formattedComponents as ApplicationErrorInformation
    case 'FII':
      return formattedComponents as FinancialInstitutionInformation
    case 'FTX':
      return formattedComponents as FreeText
    case 'GEI':
      return formattedComponents as ProcessingInformation
    case 'GIN':
      return formattedComponents as GoodsIdentityNumber
    case 'GIR':
      return formattedComponents as RelatedInformationNumbers
    case 'GIS': // removed since D02B
      return formattedComponents as GeneralIndicator
    case 'HAN':
      return formattedComponents as HandlingInstructions
    case 'HYN':
      return formattedComponents as HierarchyInformation
    case 'IDE':
      return formattedComponents as Identity
    case 'IMD':
      return formattedComponents as ItemDescription
    case 'INP':
      return formattedComponents as PartiesAndInstruction
    case 'IRQ':
      return formattedComponents as InformationRequired
    case 'LIN':
      return formattedComponents as LineItem
    case 'LOC':
      return formattedComponents as LocationIdentification
    case 'MEA':
      return formattedComponents as Measurements
    case 'MKS':
      return formattedComponents as MarketSalesChannelInformation
    case 'MOA':
      return formattedComponents as MonetaryAmount
    case 'MTD':
      return formattedComponents as MaintenanceOperationDetails
    case 'NAD':
      return formattedComponents as NameAndAddress
    case 'PAC':
      return formattedComponents as Package
    case 'PAI':
      return formattedComponents as PaymentInstructions
    case 'PAT': // removed since D02B
      return formattedComponents as PaymentTermsBasis
    case 'PCD':
      return formattedComponents as PercentageDetails
    case 'PCI':
      return formattedComponents as PackageIdentification
    case 'PGI':
      return formattedComponents as ProductGroupInformation
    case 'PIA':
      return formattedComponents as AdditionalProductId
    case 'PRI':
      return formattedComponents as PriceDetails
    case 'PYT':
      return formattedComponents as PaymentTerms
    case 'QTY':
      return formattedComponents as Quantity
    case 'QVR':
      return formattedComponents as QuantityVariances
    case 'RCS':
      return formattedComponents as RequirementsAndConditions
    case 'RFF':
      return formattedComponents as Reference
    case 'RJL':
      return formattedComponents as AccountingJournalIdentification
    case 'RNG':
      return formattedComponents as RangeDetails
    case 'RTE':
      return formattedComponents as RateDetails
    case 'SEL':
      return formattedComponents as SealNumber
    case 'SCC':
      return formattedComponents as SchedulingConditions
    case 'SEQ':
      return formattedComponents as SequenceDetails
    case 'SGP':
      return formattedComponents as SplitGoodsPlacement
    case 'STS':
      return formattedComponents as Status
    case 'TAX':
      return formattedComponents as TaxDetails
    case 'TDT':
      // eslint-disable-next-line no-case-declarations
      const lversion: string = version.toLowerCase()
      if (
        lversion === 'd18b' ||
        lversion === 'd18a' ||
        lversion === 'd17b' ||
        lversion === 'd17a' ||
        lversion === 'd16b' ||
        lversion === 'd16a' ||
        lversion === 'd15b' ||
        lversion === 'd15a' ||
        lversion === 'd14b' ||
        lversion === 'd14a' ||
        lversion === 'd13b' ||
        lversion === 'd13a' ||
        lversion === 'd12b' ||
        lversion === 'd12a' ||
        lversion === 'd11b' ||
        lversion === 'd11a'
      ) {
        return formattedComponents as TransportInformationD11a
      } else if (
        version === 'd10b' ||
        version === 'd10a' ||
        lversion === 'd09b' ||
        lversion === 'd09a' ||
        lversion === 'd08b' ||
        lversion === 'd08a' ||
        lversion === 'd07b' ||
        lversion === 'd07a' ||
        lversion === 'd06b' ||
        lversion === 'd06a' ||
        lversion === 'd05b' ||
        lversion === 'd05a' ||
        lversion === 'd04b' ||
        lversion === 'd04a' ||
        lversion === 'd03b' ||
        lversion === 'd03a' ||
        lversion === 'd02b' ||
        lversion === 'd02a'
      ) {
        return formattedComponents as TransportInformationD02b
      } else {
        return formattedComponents as DetailsOfTransport
      }
    case 'TMD':
      return formattedComponents as TransportMovementDetails
    case 'TOD':
      return formattedComponents as TermsOfDeliveryOrTransport
    case 'TSR':
      return formattedComponents as TransportServiceRequirements
    case 'UNH':
      return formattedComponents as MessageHeader
    case 'UNS':
      return formattedComponents as SectionControl
    case 'UNT':
      return formattedComponents as MessageTrailer
    default:
      return formattedComponents as Segment
  }
}

// ////////////////////////////////////////////////////////////////////////////
// Segment section
// ////////////////////////////////////////////////////////////////////////////

// AJT

export interface AdjustmentDetails {
  tag: string

  adjustmentReasonDescriptionCode: ComponentValue
  lineItemIdentifier: string | undefined
}

// ALC

interface AllowanceOrChargeInformation {
  allowanceOrChargeIdentifier: string | undefined
  allowanceOrChargeIdentificationCode: ComponentValue | undefined
}

interface SpecialServicesIdentification {
  specialServiceDescriptionCode: ComponentValue | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  specialServiceDescription: string | undefined
  specialServiceDescription2: string | undefined
}

export interface AllowanceOrCharge {
  tag: string

  allowanceOrChargeCodeQualifier: ComponentValue
  allowanceOrChargeInformation: AllowanceOrChargeInformation | undefined
  settlementMeansCode: ComponentValue | undefined
  calculationSequenceCode: ComponentValue | undefined
  specialServicesIdentification: SpecialServicesIdentification | undefined
}

// ALI

export interface AdditionalInformation {
  tag: string

  countryOfOriginIdentifier: string | undefined
  dutyRegimeTypeCode: ComponentValue | undefined
  specialConditionCode: string | undefined
  specialConditionCode2: string | undefined
  specialConditionCode3: string | undefined
  specialConditionCode4: string | undefined
  specialConditionCode5: string | undefined
}

// APR

interface PriceMultiplierInformation {
  priceMuliplierRate: number
  priceMuliplierTypeCodeQualifier: ComponentValue | undefined
}

interface ReasonForChange {
  changeReasonDescriptionCode: ComponentValue | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCoe: string | undefined
  changeReasonDescription: string | undefined
}

export interface AdditionalPriceInformation {
  tag: string

  tradeClassCode: ComponentValue | undefined
  priceMultiplierInformation: PriceMultiplierInformation | undefined
  reasonForChange: ReasonForChange | undefined
}

// ARD

interface MonetaryAmountFunctionData {
  monetaryAmountFunctionDescriptionCode: ComponentValue | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  monetaryAmountFunctionDescription: string | undefined
}

interface MonetaryAmountFunctionDetail {
  monetaryAmountFunctionDetailDescriptionCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  monetaryAmountFunctionDetailDescription: string | undefined
}

export interface MonetaryAmountFunction {
  tag: string

  monetaryAmountFunction: MonetaryAmountFunctionData | undefined
  monetaryAmountFunctionDetail: MonetaryAmountFunctionDetail | undefined
}

// AUT

export interface AuthenticationResult {
  tag: string

  validationResultText: string
  validationKeyIdentifier: string | undefined
}

// BGM

interface MessageName {
  documentNameCode: ComponentValue | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  documentName: string | undefined
}

interface MessageIdentification {
  documentIdentifier: string | undefined
  versionIdentifier: string | undefined
  revisionIdentifier: string | undefined
}

export interface BeginOfMessage {
  tag: string

  documentMessageName: MessageName | undefined
  documentMessageIdentification: string | undefined
  messageFunctionCode: ComponentValue | undefined
  responseTypeCode: ComponentValue | undefined
  documentStatusCode: ComponentValue | undefined
  languageNameCode: string | undefined
}

// BUS

interface BusinessFunctionData {
  businessFunctionTypeCodeQualifier: ComponentValue
  businessFunctionCode: ComponentValue
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  businessDescription: string | undefined
}

interface BankOperation {
  bankOperationCode: ComponentValue
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

export interface BusinessFunction {
  tag: string

  businessFunction: BusinessFunctionData | undefined
  geographicAreaCode: ComponentValue | undefined
  financialTransactionTypeCode: ComponentValue | undefined
  bankOperation: BankOperation | undefined
  intraCompanyPaymentIndicatorCode: ComponentValue | undefined
}

// CAV

interface CharacteristicValueData {
  characteristicValueDescriptionCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  characteristicValueDescription: string | undefined
  characteristicValueDescription2: string | undefined
}

export interface CharacteristicValue {
  tag: string

  characteristicValue: CharacteristicValueData
}

// CCI

interface CharacteristicDescription {
  characteristicDescriptionCode: string
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  characteristicDescription: string | undefined
  characteristicDescription2: string | undefined
}

export interface CharacteristicinterfaceID {
  tag: string

  classTypeCode: ComponentValue | undefined
  measurementDetails: ComponentValue | undefined
  characteristicDescription: CharacteristicDescription | undefined
  characteristicRelevanceCode: ComponentValue | undefined
}

// CED

interface ComputerEnviornmentIdentification {
  computerEnvironmentDetailsCodeQualifier: ComponentValue | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  computerEnvironmentName: string | undefined
  versionIdentifier: string | undefined
  releaseIdentifier: string | undefined
  objectIdentifier: string | undefined
}

export interface ComputerEnvironmentDetails {
  tag: string

  computerEnvironmentDetailsCodeQualifier: ComponentValue
  computerEnviornmentIdentification: ComputerEnviornmentIdentification
  fileGenerationCommandName: string | undefined
}

// CNT

interface Control {
  controlTotalTypeCodeQualifier: ComponentValue
  controlTotalValue: number
  measurementUnitCode: string | undefined
}

export interface ControlTotal {
  tag: string

  control: Control
}

// COD

interface TypeOfUnit {
  unitOrComponentTypeDescriptionCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  unitOrComponentTypeDescription: string | undefined
}

interface ComponentMaterial {
  componentMaterialDescriptionCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  componentMaterialDescription: string | undefined
}

export interface ComponentDetails {
  tag: string

  typeOfUnit: TypeOfUnit | undefined
  componentMaterial: ComponentMaterial | undefined
}

// COM

interface CommunicationContactData {
  communicationAddressIdentifier: string
  communicationAddressCodeQualifier: ComponentValue
}

export interface CommunicationContact {
  tag: string

  communicationContact: CommunicationContactData
}

// CPS

export interface ConsignmentPackingSequence {
  tag: string

  hierarchicalStructureLevelIdentifier: string
  hierarchicalStructureParentIdentifier: string | undefined
  packagingLevelCode: ComponentValue | undefined
}

// CTA

interface DepartmentOrEmployeeDetails {
  departmentOrEmployeeNameCode: string | undefined
  departmentOrEmployeeName: string | undefined
}

export interface ContactInformation {
  tag: string

  contactFunctionCode: ComponentValue | undefined
  departmentOrEmployeeDetails: DepartmentOrEmployeeDetails | undefined
}

// CUX

interface CurrencyDetails {
  currencyUsageCodeQualifier: ComponentValue
  currencyIdentificationCode: string | undefined
  currencyTypeCodeQualifier: ComponentValue | undefined
  currencyRate: number | undefined
}

export interface Currencies {
  tag: string

  currencyDetails: CurrencyDetails | undefined
  currencyDetails2: CurrencyDetails | undefined
  currencyExchangeRate: number | undefined
  exchangeRateCurrencyMarketIdentifier: string | undefined
}

// DGS

interface HazardCode {
  hazardIdentificationCode: string
  additionalHazardinterfaceificationIdentifier: string | undefined
  hazardCodeVersionIdentifier: string | undefined
}

interface UnitedNationsDagneoursGoodsInformation {
  unitedNationsangerousGoodsIdentifier: number | undefined
  dangerousGoodsFlashpointValue: string | undefined
}

interface DangerousGoodsShipmentFlashpoint {
  shipmentFlashpointValue: number | undefined
  measurementUnitCode: string | undefined
}

interface HazardIdentificationPlacardDetails {
  orangeHazardPlacardUpperPardIdentifier: string | undefined
  orangeHazardPlacardLowerPartIdentifier: string | undefined
}

interface DangerousGoodsLabel {
  dangerousGoodsMarkingIdentifier: string | undefined
  dangerousGoodsMarkingIdentifier2: string | undefined
  dangerousGoodsMarkingIdentifier3: string | undefined
}

export interface DangerousGoods {
  tag: string

  dangerousGoodsRegulationsCode: ComponentValue
  hazardCode: HazardCode | undefined
  undgInformation: UnitedNationsDagneoursGoodsInformation | undefined
  dangerousGoodsShipmentFlashpoint: DangerousGoodsShipmentFlashpoint | undefined
  packagingDangerLevelCode: ComponentValue | undefined
  emergencyProcedureForShipsIdentifier: string | undefined
  hazardMedicalFirstAidGuideIdentifier: string | undefined
  transportEmergencyCardIdentifier: string | undefined
  hazardIdentificationPlacardDetails:
    | HazardIdentificationPlacardDetails
    | undefined
  dangerousGoodsLabel: DangerousGoodsLabel | undefined
  packingInstructionTypeCode: string | undefined
  hazardousMeansOfTransportCategoryCode: ComponentValue | undefined
  hazardousCargoTransportAuthorizationCode: string | undefined
}

// DLM

export interface DeliveryLimitations {
  tag: string

  backOrderArrangementTypeCode: ComponentValue | undefined
  instruction: Instruction | undefined
  specialServicesIdentification: SpecialServicesIdentification | undefined
  substitutionConditionCode: ComponentValue | undefined
}

// DMS

export interface MessageSummary {
  tag: string

  messageIdentification: MessageIdentification | undefined
  messageName: MessageName | undefined
  itemTotalQuantity: number | undefined
}

// DOC

interface MessageDetailsData {
  documentIdentifer: string | undefined
  documentStatusCode: ComponentValue | undefined
  documentSourceDescription: string | undefined
  languageNameCode: string | undefined
  versionIdentifier: string | undefined
  revisionIdentifier: string | undefined
}

export interface MessageDetails {
  tag: string

  messageName: MessageName
  messageDetails: MessageDetailsData | undefined
  communicationMediumTypeCode: ComponentValue | undefined
  documentCopiesRequiredQuantity: number | undefined
  doucmentOriginalsRequiredQuantity: number | undefined
}

// DTM

interface DateTimePeriodData {
  dateOrTimeOrPeriodFunctionCodeQualifier: ComponentValue
  dateOrTimeOrPeriodText: string | undefined
  dateOrTimeOrPeriodFormatCode: ComponentValue | undefined
}

export interface DateTimePeriod {
  tag: string

  dateTimePeriod: DateTimePeriodData
}

// EFI

interface FileIdentification {
  fileName: string | undefined
  itemDescription: string | undefined
}

interface FileDetails {
  fileFormatName: string
  versionIdentifier: string | undefined
  dataFormatDescriptionCode: string | undefined
  dataFormatDescription: string | undefined
}

export interface ExternalFileLinkIdentification {
  tag: string

  fileIdentification: FileIdentification
  fileDetails: FileDetails | undefined
  sequencePositionIdentifier: string | undefined
  fileCompressionTechniqueName: string | undefined
}

// EQA

export interface AttachedEquipment {
  tag: string

  equipmentTypeCodeQualifier: ComponentValue
  equipmentIdentification: EquipmentIdentification | undefined
}

// EQD

interface EquipmentIdentification {
  equipmentIdentifier: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  countryNameCode: string | undefined
}

interface EquipmentSizeAndType {
  equipmentSizeAndTypeDescriptionCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  equipmentSizeAndTypeDescription: string | undefined
}

export interface EquipmentDetails {
  tag: string

  equipmentTypeCodeQualifier: ComponentValue
  equipmentIdentification: EquipmentIdentification | undefined
  equipmentSizeAndType: EquipmentSizeAndType | undefined
  equipmentSupplierCode: ComponentValue | undefined
  equipmentStatusCode: ComponentValue | undefined
  fullOrEmptyIndicatorCode: ComponentValue | undefined
}

// ERC

interface ApplicationErrorDetail {
  applicationErrorCode: string
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

export interface ApplicationErrorInformation {
  tag: string

  applicationErrorDetail: ApplicationErrorDetail
}

// FII

interface AccountHolderIdentification {
  accountHolderIdentifier: string | undefined
  accountHolderName: string | undefined
  accountHolderName2: string | undefined
  currencyIdentificationCode: string | undefined
}

interface InstitutionIdentification {
  institutionNameCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  institutionBranchIdentifier: string | undefined
  codeListIdentificationCode2: string | undefined
  codeListResponsibleAgencyCode2: string | undefined
  institutionName: string | undefined
  institutionBranchLocationName: string | undefined
}

export interface FinancialInstitutionInformation {
  tag: string

  partyFunctionCodeQualifier: ComponentValue
  accountHolderIdentification: AccountHolderIdentification | undefined
  institutionIdentification: InstitutionIdentification | undefined
  countryNameCode: string | undefined
}

// FTX

interface TextReference {
  freeTextValueCode: string
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

interface TextLiteral {
  freeTextValue: string
  freeTextValue2: string | undefined
  freeTextValue3: string | undefined
  freeTextValue4: string | undefined
  freeTextValue5: string | undefined
}

export interface FreeText {
  tag: string

  textSubjectCodeQualifier: ComponentValue
  freeTextFunctionCode: ComponentValue | undefined
  textReference: TextReference | undefined
  textLiteral: TextLiteral | undefined
  languageNameCode: string | undefined
  freeTextFormatCode: ComponentValue | undefined
}

// GEI

interface ProcessingIndicator {
  processingIndicatorDescriptionCode: string
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  processTypeDescriptionCode: string | undefined
}

export interface ProcessingInformation {
  tag: string

  processingInformationCodeQualifier: ComponentValue
  processingIndicator: ProcessingIndicator | undefined
  processTypeDescriptionCode: string | undefined
}

// GIN

interface IdentityNumberRange {
  objectIdentifier: string
  objectIdentifier2: string | undefined
}

export interface GoodsIdentityNumber {
  tag: string

  objectIdentificationCodeQualifier: ComponentValue
  identityNumberRange: IdentityNumberRange
  identityNumberRange2: IdentityNumberRange | undefined
  identityNumberRange3: IdentityNumberRange | undefined
  identityNumberRange4: IdentityNumberRange | undefined
  identityNumberRange5: IdentityNumberRange | undefined
}

// GIR

interface IdentificationNumber {
  objectIdentifier: string
  objectIdentificationCodeQualifier: ComponentValue | undefined
  statusDescriptionCode: string | undefined
}

export interface RelatedInformationNumbers {
  tag: string

  setTypeCodeQualifier: ComponentValue
  identificationNumber: IdentificationNumber
  identificationNumber2: IdentificationNumber | undefined
  identificationNumber3: IdentificationNumber | undefined
  identificationNumber4: IdentificationNumber | undefined
  identificationNumber5: IdentificationNumber | undefined
}

// GIS - removed with D02B

export interface GeneralIndicator {
  tag: string

  processingIndicator: ProcessingIndicator
}

// HAN

interface HandlingInstructionsData {
  handlingInstructionDescriptionCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  handlingInstructionDescription: string | undefined
}

interface HazardousMaterial {
  hazardousMaterialCategoryNameCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  hazardousMaterialCategoryName: string | undefined
}

export interface HandlingInstructions {
  tag: string

  handlingInstructions: HandlingInstructionsData | undefined
  hazardousMaterial: HazardousMaterial | undefined
}

// HYN

export interface HierarchyInformation {
  tag: string

  hierarchyObjectCodeQualifier: ComponentValue
  hierarchicalStructureRelationshipCode: ComponentValue | undefined
  actionCode: ComponentValue | undefined
  itemNumberIdentification: ItemNumberIdentification | undefined
  hierarchicalStructureParentIdentifier: string | undefined
}

// IDE

interface PositionIdentification {
  hierarchicalStructureLevelIdentifier: string | undefined
  sequencePositionIdentifier: string | undefined
}

export interface Identity {
  tag: string

  objectTypeCodeQualifier: ComponentValue
  identificationNumber: IdentificationNumber | undefined
  partyIdentificationDetails: PartyIdentificationDetails | undefined
  statusDescriptionCode: string | undefined
  configurationLevelNumber: number | undefined
  positionIdentification: PositionIdentification | undefined
  characteristicDescription: CharacteristicDescription | undefined
}

// IMD

interface ItemCharacteristic {
  itemCharacteristicCode: ComponentValue | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

interface ItemDescriptionData {
  itemDescriptionCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  itemDescription: string | undefined
  itemDescription2: string | undefined
  languageNameCode: string | undefined
}

export interface ItemDescription {
  tag: string

  descriptionFormatCode: ComponentValue | undefined
  itemCharacteristic: ItemCharacteristic | undefined
  itemDescription: ItemDescriptionData | undefined
  surfaceOrLayerCode: ComponentValue | undefined
}

// INP

interface PartiesToInstruction {
  enactingPartyIdentifier: string
  instructionReceivingPartyIdentifier: string | undefined
}

interface Instruction {
  instructionTypeCodeQualifier: ComponentValue
  instructionDescriptionCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  instructionDescription: string | undefined
}

interface StatusOfInstruction {
  statusDescriptionCode: string
  partyName: string | undefined
}

export interface PartiesAndInstruction {
  tag: string

  partiesToInstruction: PartiesToInstruction | undefined
  instruction: Instruction | undefined
  statusOfInstruction: StatusOfInstruction | undefined
  actionRequestNotificationDescriptionCode: string | undefined
}

// IRQ

interface InformationRequest {
  requestInformationDescriptionCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  requestInformationDescription: string | undefined
}

export interface InformationRequired {
  tag: string

  informationRequest: InformationRequest
}

// LIN

interface ItemNumberIdentification {
  itemIdentifier: string | undefined
  itemTypeIdentificationCode: ComponentValue | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

interface SubLineInformation {
  subLineIndicatorCode: ComponentValue | undefined
  lineItemIdentifier: string | undefined
}

export interface LineItem {
  tag: string

  lineItemIdendifier: string | undefined
  actionRequestNotificationDescriptionCode: string | undefined // renamed to action code in D06a
  itemNumberIdentification: ItemNumberIdentification | undefined
  subLineInformatin: SubLineInformation | undefined
  configurationLevelNumber: number | undefined
  configurationOperationCode: ComponentValue | undefined
}

// LOC

interface LocationIdentificationData {
  locationNameCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  locationName: string | undefined
}

interface RelatedLocationOneIdentification {
  firstRelatedLocationNameCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  firstRelatedLocationName: string | undefined
}

interface RelatedLocationTwoIdentification {
  secondRelatedLocationNameCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  secondRelatedLocationName: string | undefined
}

export interface LocationIdentification {
  tag: string

  locationFunctionCodeQualifier: ComponentValue
  locationIdentification: LocationIdentificationData | undefined
  relatedLocationOneIdentification: RelatedLocationOneIdentification | undefined
  relatedLocationTwoIdentification: RelatedLocationTwoIdentification | undefined
  relationCode: string | undefined
}

// MEA

interface MeasurementDetails {
  measuredAttributeCode: ComponentValue | undefined
  measurementSignificanceCode: ComponentValue | undefined
  nonDiscreteMeasurementNameCode: string | undefined
  nonDiscreteMeasurementName: string | undefined
}

interface ValueRange {
  measurementUnitCode: string | undefined
  measure: string | undefined
  rangeMinimumQuantity: number | undefined
  rangeMaximumQuantity: number | undefined
  significantDigitsQuantity: number | undefined
}

export interface Measurements {
  tag: string

  measurementPurposeCodeQualifier: ComponentValue
  measurementDetails: MeasurementDetails | undefined
  valueRange: ValueRange | undefined
  surfaceOrLayerCode: ComponentValue | undefined
}

// MKS

interface MarketSalesChannelDetails {
  salesChannelIdentifier: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

export interface MarketSalesChannelInformation {
  tag: string

  marketSaleChannelIdentificationCodeQualifier: ComponentValue | undefined
  marketSaleChannelSalesDetails: MarketSalesChannelDetails | undefined
  marketSaleChannelActionRequestNotificationDescriptionCode: string | undefined
}

// MOA

interface MonetaryAmountData {
  monetaryAmountTypeCodeQualifier: ComponentValue
  monetaryAmount: number | undefined
  currencyIdentificationCode: string | undefined
  currencyTypeCodeQualifier: ComponentValue | undefined
  statusDescriptionCode: string | undefined
}

export interface MonetaryAmount {
  tag: string

  monetaryAmount: MonetaryAmountData
}

// MTD

export interface MaintenanceOperationDetails {
  tag: string

  objectTypeCodeQualifier: ComponentValue
  maintenanceOperationCode: ComponentValue | undefined
  maintenanceOperationOperatorCode: ComponentValue | undefined
  maintenanceOperationPayerCode: ComponentValue | undefined
}

// NAD

interface PartyIdentificationDetails {
  partyIdentifier: string
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

interface NameAndAddressData {
  nameAndAddressDescription: string
  nameAndAddressDescription2: string | undefined
  nameAndAddressDescription3: string | undefined
  nameAndAddressDescription4: string | undefined
  nameAndAddressDescription5: string | undefined
}

interface PartyName {
  partyName: string
  partyName2: string | undefined
  partyName3: string | undefined
  partyName4: string | undefined
  partyName5: string | undefined
  partyNameFormatCode: ComponentValue | undefined
}

interface Street {
  streetAndNumberOrPostOfficeBoxIdentifier: string
  streetAndNumberOrPostOfficeBoxIdentifier2: string | undefined
  streetAndNumberOrPostOfficeBoxIdentifier3: string | undefined
  streetAndNumberOrPostOfficeBoxIdentifier4: string | undefined
}

interface CountrySubEntityDetails {
  countrySubEntityNameCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  countrySubEntityName: string | undefined
}

export interface NameAndAddress {
  tag: string

  partyFunctionCodeQualifier: ComponentValue
  partyIdentificationDetails: PartyIdentificationDetails | undefined
  nameAndAddress: NameAndAddressData | undefined
  partyName: PartyName | undefined
  street: Street | undefined
  cityName: string | undefined
  countrySubEntityDetails: CountrySubEntityDetails | undefined
  postalIdentificationCode: string | undefined
  countryNameCode: string | undefined
}

// PAC

interface PackagingDetails {
  packagingLevelCode: ComponentValue | undefined
  packagingRelatedDescriptionCode: ComponentValue | undefined
  packagingTermsAndConditionsCode: ComponentValue | undefined
}

interface PackageType {
  packageTypeDescriptionCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  typeOfPackages: string | undefined
}

interface PackageTypeIdentification {
  descriptionFormatCode: ComponentValue
  typeOfPackages: string
  itemTypeIdentificationCode: ComponentValue | undefined
  typeOfPackages2: string | undefined
  itemTypeIdentificationCode2: string | undefined
}

interface ReturnablePackageDetails {
  returnablePackageFreightPaymentResponsibilityCode: ComponentValue | undefined
  returnablePackageLoadContentsCode: ComponentValue | undefined
}

export interface Package {
  tag: string

  packageQuantity: number | undefined
  packagingDetails: PackagingDetails | undefined
  packageType: PackageType | undefined
  packageTypeIdentification: PackageTypeIdentification | undefined
  returnablePackageDetails: ReturnablePackageDetails | undefined
}

// PAI

export interface PaymentInstructions {
  tag: string

  paymendConditionsCode: ComponentValue | undefined
  paymentGuaranteeMeansCode: ComponentValue | undefined
  paymentMeansCode: ComponentValue | undefined
  codeListIdentificatinCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  paymentChannelCode: ComponentValue | undefined
}

// PAT - removed with D02B

interface PATPaymentTerms {
  paymentTermsDescriptionIdentifier: string
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  paymentTermsDescription: string | undefined
  paymentTermsDescription2: string | undefined
}

interface TermsTimeInformation {
  timeReferenceCode: ComponentValue
  termsTimeRelationCode: ComponentValue | undefined
  periodTypeCode: ComponentValue | undefined
  periodCountQuality: number | undefined
}

export interface PaymentTermsBasis {
  tag: string

  paymentTermsTypeCodeQualifier: ComponentValue
  paymentTerms: PATPaymentTerms | undefined
  termsTimeInformation: TermsTimeInformation | undefined
}

// PCD

interface PercentageDetailsData {
  percentageTypeCodeQualifier: ComponentValue
  percentage: number | undefined
  percentageBasisIdentificationCode: ComponentValue | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

export interface PercentageDetails {
  tag: string

  percentageDetails: PercentageDetailsData
  statusDescriptionCode: string | undefined
}

// PCI

interface MarksAndLabels {
  shippingMarksDescription: string
  shippingMarksDescription2: string | undefined
  shippingMarksDescription3: string | undefined
  shippingMarksDescription4: string | undefined
  shippingMarksDescription5: string | undefined
  shippingMarksDescription6: string | undefined
  shippingMarksDescription7: string | undefined
  shippingMarksDescription8: string | undefined
  shippingMarksDescription9: string | undefined
  shippingMarksDescription10: string | undefined
}

interface TypeOfMarking {
  markingTypeCode: ComponentValue
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

export interface PackageIdentification {
  tag: string

  markingInstructionCode: ComponentValue | undefined
  marksAndLabels: MarksAndLabels | undefined
  containerOrPackageContentsIndicatorCode: ComponentValue | undefined
  typeOfMarking: TypeOfMarking | undefined
}

// PGI

interface ProductGroup {
  productGroupNameCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  productGroupName: string | undefined
}

export interface ProductGroupInformation {
  tag: string

  productGroupTypeCode: ComponentValue
  productGroup: ProductGroup | undefined
}

// PIA

export interface AdditionalProductId {
  tag: string

  productIdentifierCodeQualifier: ComponentValue

  itemNumberIdentification: ItemNumberIdentification
  itemNumberIdentification2: ItemNumberIdentification | undefined
  itemNumberIdentification3: ItemNumberIdentification | undefined
  itemNumberIdentification4: ItemNumberIdentification | undefined
  itemNumberIdentification5: ItemNumberIdentification | undefined
}

// PRI

interface PriceInformation {
  priceCodeQualifier: ComponentValue
  priceAmount: number | undefined
  priceTypeCode: ComponentValue | undefined
  priceSpecificationCode: ComponentValue | undefined
  unitPriceBasisValue: number | undefined
  measurementUnitCode: string | undefined
}

export interface PriceDetails {
  tag: string

  priceInformation: PriceInformation | undefined
  subLineItemPriceChangeOperationCode: ComponentValue | undefined
}

// PYT

interface PaymentTermsData {
  paymentTermsDescriptionIdentifier: string
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  paymentTermsDescription: string | undefined
}

export interface PaymentTerms {
  tag: string

  paymentTermsTypeCodeQualifier: ComponentValue
  paymentTerms: PaymentTermsData | undefined
  timeReferenceCode: ComponentValue | undefined
  termsTimeRelationCode: ComponentValue | undefined
  periodTypeCode: ComponentValue | undefined
  periodCountQuantity: number | undefined
}

// QTY

interface QuantityDetails {
  quantityTypeCodeQualifier: ComponentValue
  quantity: number | undefined
  measurementUnitCode: string | undefined
}

export interface Quantity {
  tag: string

  quantityDetails: QuantityDetails
}

// QVR

interface QuantityDifferenceInformation {
  varianceQuantity: number
  quantityTypeCodeQualifier: ComponentValue | undefined
}

export interface QuantityVariances {
  tag: string

  quantityDifferenceInformation: QuantityDifferenceInformation | undefined
  discrepancyNatureIdentificationCode: ComponentValue | undefined
  reasonForChange: ReasonForChange | undefined
}

// RCS

interface RequirementOrConditionIdentification {
  requirementOrConditionDescriptionIdentifier: string
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  requirementOrConditionDescription: string | undefined
}

export interface RequirementsAndConditions {
  tag: string

  sectorAreaIdentificationCodeQualifier: ComponentValue
  requirementOrConditionIdentification:
    | RequirementOrConditionIdentification
    | undefined
  actionRequestNotificationDescriptionCode: string | undefined
  countryNameCode: string | undefined
}

// RFF

export interface Reference {
  tag: string

  reference: {
    referenceCodeQualifier: ComponentValue
    referenceIdentifier: string | undefined
    referenceVersionIdentifier: string | undefined
  }
  documentLineIdentifier: string | undefined
  revisionIdentifier: string | undefined
}

// RJL

interface AccountingJournalIdentificationData {
  accountingJournalIdentification: string
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  accountingJournalName: string | undefined
}

interface AccountingEntryTypeDetails {
  accountingEntryTypeNameCode: string
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  accountingEntryTypeName: string | undefined
}

export interface AccountingJournalIdentification {
  tag: string

  accountingJournalIdentification:
    | AccountingJournalIdentificationData
    | undefined
  accountingEntryTypeDetails: AccountingEntryTypeDetails | undefined
}

// RNG

interface Range {
  measurementUnitCode: string
  rangeMinimumValue: number | undefined
  rangeMaximumValue: number | undefined
}

export interface RangeDetails {
  tag: string

  rangeTypeCodeQualifier: ComponentValue
  range: Range | undefined
}

// RTE

interface RateDetailsData {
  rateTypeCodeQualifier: ComponentValue
  unitPriceBasisRate: number
  unitPriceBasisValue: number | undefined
  measurementUnitCode: string | undefined
}

export interface RateDetails {
  tag: string

  rateDetails: RateDetailsData
  statusDescriptionCode: string | undefined
}

// SEL

interface SealIssuer {
  sealingPartyNameCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  sealingPartyName: string | undefined
}

export interface SealNumber {
  tag: string

  sealIdentifier: string | undefined
  sealIssuer: SealIssuer | undefined
  sealConditionCode: ComponentValue | undefined
  identityNumberRange: IdentityNumberRange | undefined
}

// SCC

interface PatternDescription {
  frequencyCode: ComponentValue | undefined
  despatchPatternCode: ComponentValue | undefined
  despatchPatternTimingCode: ComponentValue | undefined
}

export interface SchedulingConditions {
  tag: string

  deliveryPlanCommitmentLevelCode: ComponentValue
  deliveryInstructionCode: ComponentValue | undefined
  patternDescription: PatternDescription | undefined
}

// SEQ

interface SequenceInformation {
  sequencePositionIdentifier: string
  sequenceIdentifierSoruceCode: ComponentValue | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

export interface SequenceDetails {
  tag: string

  actionCode: ComponentValue | undefined
  sequenceInformation: SequenceInformation | undefined
}

// SGP

export interface SplitGoodsPlacement {
  tag: string

  equipmentIdentification: EquipmentIdentification
  packageQuantity: number | undefined
}

// STS

interface StatusCategory {
  statusCategoryCode: ComponentValue
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

interface StatusData {
  statusDescriptionCode: ComponentValue
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  statusDescription: string | undefined
}

interface StatusReason {
  statusReasonDescriptionCode: ComponentValue
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  statusReasonDescription: string | undefined
}

export interface Status {
  tag: string

  statusCategory: StatusCategory | undefined
  status: StatusData | undefined
  statusReason: StatusReason | undefined
  statusReason2: StatusReason | undefined
  statusReason3: StatusReason | undefined
  statusReason4: StatusReason | undefined
  statusReason5: StatusReason | undefined
}

// TAX

interface DutyTaxOrFeeType {
  dutyTaxOrFeeTypeNameCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  dutyTaxOrFreeTypeName: string | undefined
}

interface DutyTaxOrFeeAccountDetail {
  dutyTaxOrFeeTypeNameCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

interface DutyTaxOrFeeDetail {
  dutyTaxOrFeeRateDescriptionCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  dutyTaxOrFeeRateDescription: string | undefined
  dutyTaxOrFeeRateBasisCode: ComponentValue | undefined
  codeListIdentificationCode2: ComponentValue | undefined
  codeListResponsibleAgencyCode2: ComponentValue | undefined
}

export interface TaxDetails {
  tag: string

  dutyTaxOrFeeFunctionCodeQualifier: ComponentValue
  dutyTaxOrFeeType: DutyTaxOrFeeType | undefined
  dutyTaxOrFeeAcountDetail: DutyTaxOrFeeAccountDetail | undefined
  dutyTaxOrFreeAssessmentBasisValue: string | undefined
  dutyTaxOrFeeDetail: DutyTaxOrFeeDetail | undefined
  dutyTaxOrFeeCategoryCode: ComponentValue | undefined
  partyTaxIdentifier: string | undefined
  calculationSequenceCode: ComponentValue | undefined
}

// TDT

interface ModeOfTransport {
  transportModeNameCode: string | undefined
  transportModeName: string | undefined
}

interface TransportMeans {
  transportMeansDescriptionCode: string | undefined
  transportMeansDescription: string | undefined
}

interface TransportMeansD02b {
  transportMeansDescriptionCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  transportMeansDescription: string | undefined
}

interface Carrier {
  carrierIdentifier: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  carrierName: string | undefined
}

interface ExcessTransportationInformation {
  excessTransportationReasonCode: ComponentValue
  excessTransportationResponsibilityCode: ComponentValue
  customerShipmentAuthorisationIdentifier: string | undefined
}

interface TransportIdentification {
  transportMeansIdentificationNameIdentifier: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  transportMeansIdentificationName: string | undefined
  transportMeansNationalityCode: string | undefined
}

// since D11a
interface PowerType {
  powerTypeCode: ComponentValue | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  powerTypeDescription: string | undefined
}

export interface DetailsOfTransport {
  tag: string

  transportStag: string
  meansOfTransportJourneyIdentifier: string | undefined
  modeOfTransport: ModeOfTransport | undefined
  transportMeans: TransportMeans | undefined
  carrier: Carrier | undefined
  transitDirectionIndicatorCode: ComponentValue | undefined
  excessTransportationInformation: ExcessTransportationInformation | undefined
  transportIdentification: TransportIdentification | undefined
  transportMeansOwnershipIndicatorCode: ComponentValue | undefined
}

export interface TransportInformationD02b {
  tag: string

  transportStag: string
  meansOfTransportJourneyIdentifier: string | undefined
  modeOfTransport: ModeOfTransport | undefined
  transportMeans: TransportMeansD02b | undefined
  carrier: Carrier | undefined
  transitDirectionIndicatorCode: ComponentValue | undefined
  excessTransportationInformation: ExcessTransportationInformation | undefined
  transportIdentification: TransportIdentification | undefined
  transportMeansOwnershipIndicatorCode: ComponentValue | undefined
}

export interface TransportInformationD11a {
  tag: string

  transportStag: string
  meansOfTransportJourneyIdentifier: string | undefined
  modeOfTransport: ModeOfTransport | undefined
  transportMeans: TransportMeansD02b | undefined
  carrier: Carrier | undefined
  transitDirectionIndicatorCode: ComponentValue | undefined
  excessTransportationInformation: ExcessTransportationInformation | undefined
  transportIdentification: TransportIdentification | undefined
  transportMeansOwnershipIndicatorCode: ComponentValue | undefined
  powerTypeDescription: PowerType | undefined
}

// TMD

interface MovementType {
  movementTypeDescriptionCode: ComponentValue | undefined
  movementTypeDescription: string | undefined
}

export interface TransportMovementDetails {
  tag: string

  movementType: MovementType | undefined
  equipmentPlanDescription: string | undefined
  haulageArrangementsCode: ComponentValue | undefined
}

// TOD

interface TermsOfDeliveryOrTransportData {
  deliveryOrTransportTermsDescriptionCode: string | undefined
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  deliveryOrTransportTermsDescription: string | undefined
  deliveryOrTransportTermsDescription2: string | undefined
}

export interface TermsOfDeliveryOrTransport {
  tag: string

  deliveryOrTransportTermsFunctionCode: ComponentValue | undefined
  transportChargesPaymentMethodCode: ComponentValue | undefined
  termsOfDeliveryOrTransport: TermsOfDeliveryOrTransportData | undefined
}

// TSR

interface ContractAndCarriageCondition {
  contractAndCarriageConditionCode: ComponentValue
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

interface Service {
  serviceRequirementCode: ComponentValue
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
  serviceRequirementCode2: string | undefined
  codeListIdentificationCode2: string | undefined
  codeListResponsibleAgencyCode2: string | undefined
}

interface TransportPriority {
  transportServicePriorityCode: ComponentValue
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

interface NatureOfCargo {
  cargoTypeinterfaceificationCode: ComponentValue
  codeListIdentificationCode: ComponentValue | undefined
  codeListResponsibleAgencyCode: ComponentValue | undefined
}

export interface TransportServiceRequirements {
  tag: string

  contractAndCarriageCondition: ContractAndCarriageCondition | undefined
  service: Service | undefined
  transportPriority: TransportPriority | undefined
  natureOfCargo: NatureOfCargo | undefined
}

// UNH

interface MessageIdentifier {
  messageType: string
  messageVersionNumber: string
  messageReleaseNumber: string
  controllingAgencyCoded: string
  associationAssignedCode: string | undefined
  codeListDirectoryVersionNumber: string | undefined
  messageTypeSubFunctionidentification: string | undefined
}

interface StatusOfTransfer {
  sequenceOfTransfers: number
  firstAndLastTransfer: string | undefined
}

interface MessageSubsetIdentification {
  messageSubsetIdentification: string
  messageSubsetVersionNumber: string | undefined
  messageSubsetReleaseNumber: string | undefined
  controllingAgencyCoded: string | undefined
}

interface MessageImplementationGuidelineIdentification {
  messageImplementationGuidelineIdentification: string
  messageImplementationGuidelineVersionNumber: string | undefined
  messageImplementationGuidelineReleaseNumber: string | undefined
  controllingAgencyCoded: string | undefined
}

interface ScenarioIdentification {
  scenarioIdentification: string
  scenarioVersionNumber: string | undefined
  scenarioReleaseNumber: string | undefined
  controllingAgencyCoded: string | undefined
}

export interface MessageHeader {
  tag: string

  messageReferenceNumber: string
  messageIdentifier: MessageIdentifier
  commonAccessReference: string | undefined
  statusOfTransfer: StatusOfTransfer | undefined
  messageSubsetIdentification: MessageSubsetIdentification | undefined
  messageImplementationGuidelineIdentification:
    | MessageImplementationGuidelineIdentification
    | undefined
  scenarioIdentification: ScenarioIdentification | undefined
}

// UNS

export interface SectionControl {
  tag: string

  sectionIdentification: string
}

// UNT

export interface MessageTrailer {
  tag: string

  numberOfSegmentsInAMessage: number
  messageReferenceNumber: string
}
