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

import { ResultType } from './reader';
import { formatComponents } from './util';

export function sanitizeFloat(str: string, decimalSymbol: string): number {
    const updatedStr: string = str.replace(decimalSymbol, '.');
    return parseFloat(updatedStr);
}

export interface Segment {
    tag: string;
}

export function toSegmentObject(
    data: ResultType,
    version: string,
    decimalSeparator: string
): Segment {
    const formattedComponents = formatComponents(
        data.elements,
        data.name,
        decimalSeparator
    );

    switch (data.name) {
        case 'AJT':
            return formattedComponents as AdjustmentDetails;
        case 'ALC':
            return formattedComponents as AllowanceOrCharge;
        case 'ALI':
            return formattedComponents as AdditionalInformation;
        case 'APR':
            return formattedComponents as AdditionalPriceInformation;
        case 'ARD':
            return formattedComponents as MonetaryAmountFunction;
        case 'AUT':
            return formattedComponents as AuthenticationResult;
        case 'BGM':
            return formattedComponents as BeginOfMessage;
        case 'BUS':
            return formattedComponents as BusinessFunction;
        case 'CAV':
            return formattedComponents as CharacteristicValue;
        case 'CCI':
            return formattedComponents as CharacteristicinterfaceID;
        case 'CED':
            return formattedComponents as ComputerEnvironmentDetails;
        case 'CNT':
            return formattedComponents as ControlTotal;
        case 'COD':
            return formattedComponents as ComponentDetails;
        case 'COM':
            return formattedComponents as CommunicationContact;
        case 'CPS':
            return formattedComponents as ConsignmentPackingSequence;
        case 'CTA':
            return formattedComponents as ContactInformation;
        case 'CUX':
            return formattedComponents as Currencies;
        case 'DGS':
            return formattedComponents as DangerousGoods;
        case 'DLM':
            return formattedComponents as DeliveryLimitations;
        case 'DMS':
            return formattedComponents as MessageSummary;
        case 'DOC':
            return formattedComponents as MessageDetails;
        case 'DTM':
            return formattedComponents as DateTimePeriod;
        case 'EFI':
            return formattedComponents as ExternalFileLinkIdentification;
        case 'EQA':
            return formattedComponents as AttachedEquipment;
        case 'EQD':
            return formattedComponents as EquipmentDetails;
        case 'ERC':
            return formattedComponents as ApplicationErrorInformation;
        case 'FII':
            return formattedComponents as FinancialInstitutionInformation;
        case 'FTX':
            return formattedComponents as FreeText;
        case 'GEI':
            return formattedComponents as ProcessingInformation;
        case 'GIN':
            return formattedComponents as GoodsIdentityNumber;
        case 'GIR':
            return formattedComponents as RelatedInformationNumbers;
        case 'GIS': // removed since D02B
            return formattedComponents as GeneralIndicator;
        case 'HAN':
            return formattedComponents as HandlingInstructions;
        case 'HYN':
            return formattedComponents as HierarchyInformation;
        case 'IDE':
            return formattedComponents as Identity;
        case 'IMD':
            return formattedComponents as ItemDescription;
        case 'INP':
            return formattedComponents as PartiesAndInstruction;
        case 'IRQ':
            return formattedComponents as InformationRequired;
        case 'LIN':
            return formattedComponents as LineItem;
        case 'LOC':
            return formattedComponents as LocationIdentification;
        case 'MEA':
            return formattedComponents as Measurements;
        case 'MKS':
            return formattedComponents as MarketSalesChannelInformation;
        case 'MOA':
            return formattedComponents as MonetaryAmount;
        case 'MTD':
            return formattedComponents as MaintenanceOperationDetails;
        case 'NAD':
            return formattedComponents as NameAndAddress;
        case 'PAC':
            return formattedComponents as Package;
        case 'PAI':
            return formattedComponents as PaymentInstructions;
        case 'PAT': // removed since D02B
            return formattedComponents as PaymentTermsBasis;
        case 'PCD':
            return formattedComponents as PercentageDetails;
        case 'PCI':
            return formattedComponents as PackageIdentification;
        case 'PGI':
            return formattedComponents as ProductGroupInformation;
        case 'PIA':
            return formattedComponents as AdditionalProductId;
        case 'PRI':
            return formattedComponents as PriceDetails;
        case 'PYT':
            return formattedComponents as PaymentTerms;
        case 'QTY':
            return formattedComponents as Quantity;
        case 'QVR':
            return formattedComponents as QuantityVariances;
        case 'RCS':
            return formattedComponents as RequirementsAndConditions;
        case 'RFF':
            return formattedComponents as Reference;
        case 'RJL':
            return formattedComponents as AccountingJournalIdentification;
        case 'RNG':
            return formattedComponents as RangeDetails;
        case 'RTE':
            return formattedComponents as RateDetails;
        case 'SEL':
            return formattedComponents as SealNumber;
        case 'SCC':
            return formattedComponents as SchedulingConditions;
        case 'SEQ':
            return formattedComponents as SequenceDetails;
        case 'SGP':
            return formattedComponents as SplitGoodsPlacement;
        case 'STS':
            return formattedComponents as Status;
        case 'TAX':
            return formattedComponents as TaxDetails;
        case 'TDT':
            // eslint-disable-next-line no-case-declarations
            const lversion: string = version.toLowerCase();
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
                return formattedComponents as TransportInformationD11a;
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
                return formattedComponents as TransportInformationD02b;
            } else {
                return formattedComponents as DetailsOfTransport;
            }
        case 'TMD':
            return formattedComponents as TransportMovementDetails;
        case 'TOD':
            return formattedComponents as TermsOfDeliveryOrTransport;
        case 'TSR':
            return formattedComponents as TransportServiceRequirements;
        case 'UNH':
            return formattedComponents as MessageHeader;
        case 'UNS':
            return formattedComponents as SectionControl;
        case 'UNT':
            return formattedComponents as MessageTrailer;
        default:
            return formattedComponents as Segment;
    }
}

// ////////////////////////////////////////////////////////////////////////////
// Segment section
// ////////////////////////////////////////////////////////////////////////////

// AJT

export interface AdjustmentDetails {
    tag: string;

    adjustmentReasonDescriptionCode: string;
    lineItemIdentifier: string | undefined;
}

// ALC

interface AllowanceOrChargeInformation {
    allowanceOrChargeIdentifier: string | undefined;
    allowanceOrChargeIdentificationCode: string | undefined;
}

interface SpecialServicesIdentification {
    specialServiceDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    specialServiceDescription: string | undefined;
    specialServiceDescription2: string | undefined;
}

export interface AllowanceOrCharge {
    tag: string;

    allowanceOrChargeCodeQualifier: string;
    allowanceOrChargeInformation: AllowanceOrChargeInformation | undefined;
    settlementMeansCode: string | undefined;
    calculationSequenceCode: string | undefined;
    specialServicesIdentification: SpecialServicesIdentification | undefined;
}

// ALI

export interface AdditionalInformation {
    tag: string;

    countryOfOriginIdentifier: string | undefined;
    dutyRegimeTypeCode: string | undefined;
    specialConditionCode1: string | undefined;
    specialConditionCode2: string | undefined;
    specialConditionCode3: string | undefined;
    specialConditionCode4: string | undefined;
    specialConditionCode5: string | undefined;
}

// APR

interface PriceMultiplierInformation {
    priceMuliplierRate: number;
    priceMuliplierTypeCodeQualifier: string | undefined;
}

interface ReasonForChange {
    changeReasonDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCoe: string | undefined;
    changeReasonDescription: string | undefined;
}

export interface AdditionalPriceInformation {
    tag: string;

    tradeinterfaceCode: string | undefined;
    priceMultiplierInformation: PriceMultiplierInformation | undefined;
    reasonForChange: ReasonForChange | undefined;
}

// ARD

interface MonetaryAmountFunctionData {
    monetaryAmountFunctionDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    monetaryAmountFunctionDescription: string | undefined;
}

interface MonetaryAmountFunctionDetail {
    monetaryAmountFunctionDetailDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    monetaryAmountFunctionDetailDescription: string | undefined;
}

export interface MonetaryAmountFunction {
    tag: string;

    monetaryAmountFunction: MonetaryAmountFunctionData | undefined;
    monetaryAmountFunctionDetail: MonetaryAmountFunctionDetail | undefined;
}

// AUT

export interface AuthenticationResult {
    tag: string;

    validationResultText: string;
    validationKeyIdentifier: string | undefined;
}

// BGM

interface MessageName {
    documentNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    documentName: string | undefined;
}

interface MessageIdentification {
    documentIdentifier: string | undefined;
    versionIdentifier: string | undefined;
    revisionIdentifier: string | undefined;
}

export interface BeginOfMessage {
    tag: string;

    documentMessageName: MessageName | undefined;
    documentMessageIdentification: string | undefined;
    messageFunctionCode: string | undefined;
    responseTypeCode: string | undefined;
    documentStatusCode: string | undefined;
    languageNameCode: string | undefined;
}

// BUS

interface BusinessFunctionData {
    businessFunctionTypeCodeQualifier: string;
    businessFunctionCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    businessDescription: string | undefined;
}

interface BankOperation {
    bankOperationCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

export interface BusinessFunction {
    tag: string;

    businessFunction: BusinessFunctionData | undefined;
    geographicAreaCode: string | undefined;
    financialTransactionTypeCode: string | undefined;
    bankOperation: BankOperation | undefined;
    intraCompanyPaymentIndicatorCode: string | undefined;
}

// CAV

interface CharacteristicValueData {
    characteristicValueDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    characteristicValueDescription: string | undefined;
    characteristicValueDescription2: string | undefined;
}

export interface CharacteristicValue {
    tag: string;

    characteristicValue: CharacteristicValueData;
}

// CCI

interface CharacteristicDescription {
    characteristicDescriptionCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    characteristicDescription: string | undefined;
    characteristicDescription2: string | undefined;
}

export interface CharacteristicinterfaceID {
    tag: string;

    interfaceTypeCode: string | undefined;
    measurementDetails: string | undefined;
    characteristicDescription: CharacteristicDescription | undefined;
    characteristicRelevanceCode: string | undefined;
}

// CED

interface ComputerEnviornmentIdentification {
    computerEnvironmentNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    computerEnvironmentName: string | undefined;
    versionIdentifier: string | undefined;
    releaseIdentifier: string | undefined;
    objectIdentifier: string | undefined;
}

export interface ComputerEnvironmentDetails {
    tag: string;

    computerEnvironmentDetailsCodeQualifier: string;
    computerEnviornmentIdentification: ComputerEnviornmentIdentification;
    fileGenerationCommandName: string | undefined;
}

// CNT

interface Control {
    controlTotalTypeCodeQualifier: string;
    controlTotalValue: number;
    measurementUnitCode: string | undefined;
}

export interface ControlTotal {
    tag: string;

    control: Control;
}

// COD

interface TypeOfUnit {
    unitOrComponentTypeDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    unitOrComponentTypeDescription: string | undefined;
}

interface ComponentMaterial {
    componentMaterialDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    componentMaterialDescription: string | undefined;
}

export interface ComponentDetails {
    tag: string;

    typeOfUnit: TypeOfUnit | undefined;
    componentMaterial: ComponentMaterial | undefined;
}

// COM

interface CommunicationContactData {
    communicationAddressIdentifier: string;
    communicationAddressCodeQualifier: string;
}

export interface CommunicationContact {
    tag: string;

    communicationContact: CommunicationContactData;
}

// CPS

export interface ConsignmentPackingSequence {
    tag: string;

    hierarchicalStructureLevelIdentifier: string;
    hierarchicalStructureParentIdentifier: string | undefined;
    packagingLevelCode: string | undefined;
}

// CTA

interface DepartmentOrEmployeeDetails {
    departmentOrEmployeeNameCode: string | undefined;
    departmentOrEmployeeName: string | undefined;
}

export interface ContactInformation {
    tag: string;

    contactFunctionCode: string | undefined;
    departmentOrEmployeeDetails: DepartmentOrEmployeeDetails | undefined;
}

// CUX

interface CurrencyDetails {
    currencyUsageCodeQualifier: string;
    currencyIdentificationCode: string | undefined;
    currencyTypeCodeQualifier: string | undefined;
    currencyRate: number | undefined;
}

export interface Currencies {
    tag: string;

    currencyDetails1: CurrencyDetails | undefined;
    currencyDetails2: CurrencyDetails | undefined;
    currencyExchangeRate: number | undefined;
    exchangeRateCurrencyMarketIdentifier: string | undefined;
}

// DGS

interface HazardCode {
    hazardIdentificationCode: string;
    additionalHazardinterfaceificationIdentifier: string | undefined;
    hazardCodeVersionIdentifier: string | undefined;
}

interface UnitedNationsDagneoursGoodsInformation {
    unitedNationsangerousGoodsIdentifier: number | undefined;
    dangerousGoodsFlashpointValue: string | undefined;
}

interface DangerousGoodsShipmentFlashpoint {
    shipmentFlashpointValue: number | undefined;
    measurementUnitCode: string | undefined;
}

interface HazardIdentificationPlacardDetails {
    orangeHazardPlacardUpperPardIdentifier: string | undefined;
    orangeHazardPlacardLowerPartIdentifier: string | undefined;
}

interface DangerousGoodsLabel {
    dangerousGoodsMarkingIdentifier1: string | undefined;
    dangerousGoodsMarkingIdentifier2: string | undefined;
    dangerousGoodsMarkingIdentifier3: string | undefined;
}

export interface DangerousGoods {
    tag: string;

    dangerousGoodsRegulationsCode: string;
    hazardCode: HazardCode | undefined;
    undgInformation: UnitedNationsDagneoursGoodsInformation | undefined;
    dangerousGoodsShipmentFlashpoint:
        | DangerousGoodsShipmentFlashpoint
        | undefined;
    packagingDangerLevelCode: string | undefined;
    emergencyProcedureForShipsIdentifier: string | undefined;
    hazardMedicalFirstAidGuideIdentifier: string | undefined;
    transportEmergencyCardIdentifier: string | undefined;
    hazardIdentificationPlacardDetails:
        | HazardIdentificationPlacardDetails
        | undefined;
    dangerousGoodsLabel: DangerousGoodsLabel | undefined;
    packingInstructionTypeCode: string | undefined;
    hazardousMeansOfTransportCategoryCode: string | undefined;
    hazardousCargoTransportAuthorizationCode: string | undefined;
}

// DLM

export interface DeliveryLimitations {
    tag: string;

    backOrderArrangementTypeCode: string | undefined;
    instruction: Instruction | undefined;
    specialServicesIdentification: SpecialServicesIdentification | undefined;
    substitutionConditionCode: string | undefined;
}

// DMS

export interface MessageSummary {
    tag: string;

    messageIdentification: MessageIdentification | undefined;
    messageName: MessageName | undefined;
    itemTotalQuantity: number | undefined;
}

// DOC

interface MessageDetailsData {
    documentIdentifer: string | undefined;
    documentStatusCode: string | undefined;
    documentSourceDescription: string | undefined;
    languageNameCode: string | undefined;
    versionIdentifier: string | undefined;
    revisionIdentifier: string | undefined;
}

export interface MessageDetails {
    tag: string;

    messageName: MessageName;
    messageDetails: MessageDetailsData | undefined;
    communicationMediumTypeCode: string | undefined;
    documentCopiesRequiredQuantity: number | undefined;
    doucmentOriginalsRequiredQuantity: number | undefined;
}

// DTM

interface DateTimePeriodData {
    dateTimeOrPeriodFunctionCodeQualifier: string;
    dateTimeOrPeriodText: string | undefined;
    dateTimeOrPeriodFormatCode: string | undefined;
}

export interface DateTimePeriod {
    tag: string;

    dateTimePeriod: DateTimePeriodData;
}

// EFI

interface FileIdentification {
    fileName: string | undefined;
    itemDescription: string | undefined;
}

interface FileDetails {
    fileFormatName: string;
    versionIdentifier: string | undefined;
    dataFormatDescriptionCode: string | undefined;
    dataFormatDescription: string | undefined;
}

export interface ExternalFileLinkIdentification {
    tag: string;

    fileIdentification: FileIdentification;
    fileDetails: FileDetails | undefined;
    sequencePositionIdentifier: string | undefined;
    fileCompressionTechniqueName: string | undefined;
}

// EQA

export interface AttachedEquipment {
    tag: string;

    equipmentTypeCodeQualifier: string;
    equipmentIdentification: EquipmentIdentification | undefined;
}

// EQD

interface EquipmentIdentification {
    equipmentIdentifier: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    countryNameCode: string | undefined;
}

interface EquipmentSizeAndType {
    equipmentSizeAndTypeDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    equipmentSizeAndTypeDescription: string | undefined;
}

export interface EquipmentDetails {
    tag: string;

    equipmentTypeCodeQualifier: string;
    equipmentIdentification: EquipmentIdentification | undefined;
    equipmentSizeAndType: EquipmentSizeAndType | undefined;
    equipmentSupplierCode: string | undefined;
    equipmentStatusCode: string | undefined;
    fullOrEmptyIndicatorCode: string | undefined;
}

// ERC

interface ApplicationErrorDetail {
    applicationErrorCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

export interface ApplicationErrorInformation {
    tag: string;

    applicationErrorDetail: ApplicationErrorDetail;
}

// FII

interface AccountHolderIdentification {
    accountHolderIdentifier: string | undefined;
    accountHolderName: string | undefined;
    accountHolderName2: string | undefined;
    currencyIdentificationCode: string | undefined;
}

interface InstitutionIdentification {
    institutionNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    institutionBranchIdentifier: string | undefined;
    codeListIdentificationCode2: string | undefined;
    codeListResponsibleAgencyCode2: string | undefined;
    institutionName: string | undefined;
    institutionBranchLocationName: string | undefined;
}

export interface FinancialInstitutionInformation {
    tag: string;

    partyFunctionCodeQualifier: string;
    accountHolderIdentification: AccountHolderIdentification | undefined;
    institutionIdentification: InstitutionIdentification | undefined;
    countryNameCode: string | undefined;
}

// FTX

interface TextReference {
    freeTextValueCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

interface TextLiteral {
    freeTextValue1: string;
    freeTextValue2: string | undefined;
    freeTextValue3: string | undefined;
    freeTextValue4: string | undefined;
    freeTextValue5: string | undefined;
}

export interface FreeText {
    tag: string;

    textSubjectCodeQualifier: string;
    freeTextFunctionCode: string | undefined;
    textReference: TextReference | undefined;
    textLiteral: TextLiteral | undefined;
    languageNameCode: string | undefined;
    freeTextFormatCode: string | undefined;
}

// GEI

interface ProcessingIndicator {
    processingIndicatorDescriptionCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    processTypeDescriptionCode: string | undefined;
}

export interface ProcessingInformation {
    tag: string;

    processingInformationCodeQualifier: string;
    processingIndicator: ProcessingIndicator | undefined;
    processTypeDescriptionCode: string | undefined;
}

// GIN

interface IdentityNumberRange {
    objectIdentifier1: string;
    objectIdentifier2: string | undefined;
}

export interface GoodsIdentityNumber {
    tag: string;

    objectIdentificationCodeQualifier: string;
    identityNumberRange1: IdentityNumberRange;
    identityNumberRange2: IdentityNumberRange | undefined;
    identityNumberRange3: IdentityNumberRange | undefined;
    identityNumberRange4: IdentityNumberRange | undefined;
    identityNumberRange5: IdentityNumberRange | undefined;
}

// GIR

interface IdentificationNumber {
    objectIdentifier: string;
    objectIdentificationCodeQualifier: string | undefined;
    statusDescriptionCode: string | undefined;
}

export interface RelatedInformationNumbers {
    tag: string;

    setTypeCodeQualifier: string;
    identificationNumber1: IdentificationNumber;
    identificationNumber2: IdentificationNumber | undefined;
    identificationNumber3: IdentificationNumber | undefined;
    identificationNumber4: IdentificationNumber | undefined;
    identificationNumber5: IdentificationNumber | undefined;
}

// GIS - removed with D02B

export interface GeneralIndicator {
    tag: string;

    processingIndicator: ProcessingIndicator;
}

// HAN

interface HandlingInstructionsData {
    handlingInstructionDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    handlingInstructionDescription: string | undefined;
}

interface HazardousMaterial {
    hazardousMaterialCategoryNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    hazardousMaterialCategoryName: string | undefined;
}

export interface HandlingInstructions {
    tag: string;

    handlingInstructions: HandlingInstructionsData | undefined;
    hazardousMaterial: HazardousMaterial | undefined;
}

// HYN

export interface HierarchyInformation {
    tag: string;

    hierarchyObjectCodeQualifier: string;
    hierarchicalStructureRelationshipCode: string | undefined;
    actionCode: string | undefined;
    itemNumberIdentification: ItemNumberIdentification | undefined;
    hierarchicalStructureParentIdentifier: string | undefined;
}

// IDE

interface PositionIdentification {
    hierarchicalStructureLevelIdentifier: string | undefined;
    sequencePositionIdentifier: string | undefined;
}

export interface Identity {
    tag: string;

    objectTypeCodeQualifier: string;
    identificationNumber: IdentificationNumber | undefined;
    partyIdentificationDetails: PartyIdentificationDetails | undefined;
    statusDescriptionCode: string | undefined;
    configurationLevelNumber: number | undefined;
    positionIdentification: PositionIdentification | undefined;
    characteristicDescription: CharacteristicDescription | undefined;
}

// IMD

interface ItemCharacteristic {
    itemCharacteristicCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

interface ItemDescriptionData {
    itemDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    itemDescription: string | undefined;
    itemDescription2: string | undefined;
    languageNameCode: string | undefined;
}

export interface ItemDescription {
    tag: string;

    descriptionFormatCode: string | undefined;
    itemCharacteristic: ItemCharacteristic | undefined;
    itemDescription: ItemDescriptionData | undefined;
    surfaceOrLayerCode: string | undefined;
}

// INP

interface PartiesToInstruction {
    enactingPartyIdentifier: string;
    instructionReceivingPartyIdentifier: string | undefined;
}

interface Instruction {
    instructionTypeCodeQualifier: string;
    instructionDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    instructionDescription: string | undefined;
}

interface StatusOfInstruction {
    statusDescriptionCode: string;
    partyName: string | undefined;
}

export interface PartiesAndInstruction {
    tag: string;

    partiesToInstruction: PartiesToInstruction | undefined;
    instruction: Instruction | undefined;
    statusOfInstruction: StatusOfInstruction | undefined;
    actionRequestNotificationDescriptionCode: string | undefined;
}

// IRQ

interface InformationRequest {
    requestInformationDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    requestInformationDescription: string | undefined;
}

export interface InformationRequired {
    tag: string;

    informationRequest: InformationRequest;
}

// LIN

interface ItemNumberIdentification {
    itemIdentifier: string | undefined;
    itemTypeIdentificationCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

interface SubLineInformation {
    subLineIndicatorCode: string | undefined;
    lineItemIdentifier: string | undefined;
}

export interface LineItem {
    tag: string;

    lineItemIdendifier: string | undefined;
    actionRequestNotificationDescriptionCode: string | undefined; // renamed to action code in D06a
    itemNumberIdentification: ItemNumberIdentification | undefined;
    subLineInformatin: SubLineInformation | undefined;
    configurationLevelNumber: number | undefined;
    configurationOperationCode: string | undefined;
}

// LOC

interface LocationIdentificationData {
    locationNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    locationName: string | undefined;
}

interface RelatedLocationOneIdentification {
    firstRelatedLocationNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    firstRelatedLocationName: string | undefined;
}

interface RelatedLocationTwoIdentification {
    secondRelatedLocationNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    secondRelatedLocationName: string | undefined;
}

export interface LocationIdentification {
    tag: string;

    locationFunctionCodeQualifier: string;
    locationIdentification: LocationIdentificationData | undefined;
    relatedLocationOneIdentification:
        | RelatedLocationOneIdentification
        | undefined;
    relatedLocationTwoIdentification:
        | RelatedLocationTwoIdentification
        | undefined;
    relationCode: string | undefined;
}

// MEA

interface MeasurementDetails {
    measuredAttributeCode: string | undefined;
    measurementSignificanceCode: string | undefined;
    nonDiscreteMeasurementNameCode: string | undefined;
    nonDiscreteMeasurementName: string | undefined;
}

interface ValueRange {
    measurementUnitCode: string | undefined;
    measure: string | undefined;
    rangeMinimumQuantity: number | undefined;
    rangeMaximumQuantity: number | undefined;
    significantDigitsQuantity: number | undefined;
}

export interface Measurements {
    tag: string;

    measurementPurposeCodeQualifier: string;
    measurementDetails: MeasurementDetails | undefined;
    valueRange: ValueRange | undefined;
    surfaceOrLayerCode: string | undefined;
}

// MKS

interface MarketSalesChannelDetails {
    salesChannelIdentifier: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

export interface MarketSalesChannelInformation {
    tag: string;

    marketSaleChannelIdentificationCodeQualifier: string | undefined;
    marketSaleChannelSalesDetails: MarketSalesChannelDetails | undefined;
    marketSaleChannelActionRequestNotificationDescriptionCode:
        | string
        | undefined;
}

// MOA

interface MonetaryAmountData {
    monetaryAmountTypeCodeQualifier: string;
    monetaryAmount: number | undefined;
    currencyIdentificationCode: string | undefined;
    currencyTypeCodeQualifier: string | undefined;
    statusDescriptionCode: string | undefined;
}

export interface MonetaryAmount {
    tag: string;

    monetaryAmount: MonetaryAmountData;
}

// MTD

export interface MaintenanceOperationDetails {
    tag: string;

    objectTypeCodeQualifier: string;
    maintenanceOperationCode: string | undefined;
    maintenanceOperationOperatorCode: string | undefined;
    maintenanceOperationPayerCode: string | undefined;
}

// NAD

interface PartyIdentificationDetails {
    partyIdentifier: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

interface NameAndAddressData {
    nameAndAddressDescription1: string;
    nameAndAddressDescription2: string | undefined;
    nameAndAddressDescription3: string | undefined;
    nameAndAddressDescription4: string | undefined;
    nameAndAddressDescription5: string | undefined;
}

interface PartyName {
    partyName1: string;
    partyName2: string | undefined;
    partyName3: string | undefined;
    partyName4: string | undefined;
    partyName5: string | undefined;
    partyNameFormatCode: string | undefined;
}

interface Street {
    streetAndNumberOrPostOfficeBoxIdentifier1: string;
    streetAndNumberOrPostOfficeBoxIdentifier2: string | undefined;
    streetAndNumberOrPostOfficeBoxIdentifier3: string | undefined;
    streetAndNumberOrPostOfficeBoxIdentifier4: string | undefined;
}

interface CountrySubEntityDetails {
    countrySubEntityNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    countrySubEntityName: string | undefined;
}

export interface NameAndAddress {
    tag: string;

    partyFunctionCodeQualifier: string;
    partyIdentificationDetails: PartyIdentificationDetails | undefined;
    nameAndAddress: NameAndAddressData | undefined;
    partyName: PartyName | undefined;
    street: Street | undefined;
    cityName: string | undefined;
    countrySubEntityDetails: CountrySubEntityDetails | undefined;
    postalIdentificationCode: string | undefined;
    countryNameCode: string | undefined;
}

// PAC

interface PackagingDetails {
    packagingLevelCode: string | undefined;
    packagingRelatedDescriptionCode: string | undefined;
    packagingTermsAndConditionsCode: string | undefined;
}

interface PackageType {
    packageTypeDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    typeOfPackages: string | undefined;
}

interface PackageTypeIdentification {
    descriptionFormatCode: string;
    typeOfPackages: string;
    itemTypeIdentificationCode: string | undefined;
    typeOfPackages2: string | undefined;
    itemTypeIdentificationCode2: string | undefined;
}

interface ReturnablePackageDetails {
    returnablePackageFreightPaymentResponsibilityCode: string | undefined;
    returnablePackageLoadContentsCode: string | undefined;
}

export interface Package {
    tag: string;

    packageQuantity: number | undefined;
    packagingDetails: PackagingDetails | undefined;
    packageType: PackageType | undefined;
    packageTypeIdentification: PackageTypeIdentification | undefined;
    returnablePackageDetails: ReturnablePackageDetails | undefined;
}

// PAI

export interface PaymentInstructions {
    tag: string;

    paymendConditionsCode: string | undefined;
    paymentGuaranteeMeansCode: string | undefined;
    paymentMeansCode: string | undefined;
    codeListIdentificatinCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    paymentChannelCode: string | undefined;
}

// PAT - removed with D02B

interface PATPaymentTerms {
    paymentTermsDescriptionIdentifier: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    paymentTermsDescription1: string | undefined;
    paymentTermsDescription2: string | undefined;
}

interface TermsTimeInformation {
    timeReferenceCode: string;
    termsTimeRelationCode: string | undefined;
    periodTypeCode: string | undefined;
    periodCountQuality: number | undefined;
}

export interface PaymentTermsBasis {
    tag: string;

    paymentTermsTypeCodeQualifier: string;
    paymentTerms: PATPaymentTerms | undefined;
    termsTimeInformation: TermsTimeInformation | undefined;
}

// PCD

interface PercentageDetailsData {
    percentageTypeCodeQualifier: string;
    percentage: number | undefined;
    percentageBasisIdentificationCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

export interface PercentageDetails {
    tag: string;

    percentageDetails: PercentageDetailsData;
    statusDescriptionCode: string | undefined;
}

// PCI

interface MarksAndLabels {
    shippingMarksDescription1: string;
    shippingMarksDescription2: string | undefined;
    shippingMarksDescription3: string | undefined;
    shippingMarksDescription4: string | undefined;
    shippingMarksDescription5: string | undefined;
    shippingMarksDescription6: string | undefined;
    shippingMarksDescription7: string | undefined;
    shippingMarksDescription8: string | undefined;
    shippingMarksDescription9: string | undefined;
    shippingMarksDescription10: string | undefined;
}

interface TypeOfMarking {
    markingTypeCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

export interface PackageIdentification {
    tag: string;

    markingInstructionCode: string | undefined;
    marksAndLabels: MarksAndLabels | undefined;
    containerOrPackageContentsIndicatorCode: string | undefined;
    typeOfMarking: TypeOfMarking | undefined;
}

// PGI

interface ProductGroup {
    productGroupNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    productGroupName: string | undefined;
}

export interface ProductGroupInformation {
    tag: string;

    productGroupTypeCode: string;
    productGroup: ProductGroup | undefined;
}

// PIA

export interface AdditionalProductId {
    tag: string;

    productIdentifierCodeQualifier: string;

    itemNumberIdentification1: ItemNumberIdentification;
    itemNumberIdentification2: ItemNumberIdentification | undefined;
    itemNumberIdentification3: ItemNumberIdentification | undefined;
    itemNumberIdentification4: ItemNumberIdentification | undefined;
    itemNumberIdentification5: ItemNumberIdentification | undefined;
}

// PRI

interface PriceInformation {
    priceCodeQualifier: string;
    priceAmount: number | undefined;
    priceTypeCode: string | undefined;
    priceSpecificationCode: string | undefined;
    unitPriceBasisValue: number | undefined;
    measurementUnitCode: string | undefined;
}

export interface PriceDetails {
    tag: string;

    priceInformation: PriceInformation | undefined;
    subLineItemPriceChangeOperationCode: string | undefined;
}

// PYT

interface PaymentTermsData {
    paymentTermsDescriptionIdentifier: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    paymentTermsDescription: string | undefined;
}

export interface PaymentTerms {
    tag: string;

    paymentTermsTypeCodeQualifier: string;
    paymentTerms: PaymentTermsData | undefined;
    eventTimeReferenceCode: string | undefined;
    termsTimeRelationCode: string | undefined;
    periodTypeCode: string | undefined;
    periodCountQuantity: number | undefined;
}

// QTY

interface QuantityDetails {
    quantityTypeCodeQualifier: string;
    quantity: number | undefined;
    measurementUnitCode: string | undefined;
}

export interface Quantity {
    tag: string;

    quantityDetails: QuantityDetails;
}

// QVR

interface QuantityDifferenceInformation {
    varianceQuantity: number;
    quantityTypeCodeQualifier: string | undefined;
}

export interface QuantityVariances {
    tag: string;

    quantityDifferenceInformation: QuantityDifferenceInformation | undefined;
    discrepancyNatureIdentificationCode: string | undefined;
    reasonForChange: ReasonForChange | undefined;
}

// RCS

interface RequirementOrConditionIdentification {
    requirementOrConditionDescriptionIdentifier: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    requirementOrConditionDescription: string | undefined;
}

export interface RequirementsAndConditions {
    tag: string;

    sectorAreaIdentificationCodeQualifier: string;
    requirementOrConditionIdentification:
        | RequirementOrConditionIdentification
        | undefined;
    actionRequestNotificationDescriptionCode: string | undefined;
    countryNameCode: string | undefined;
}

// RFF

export interface Reference {
    tag: string;

    reference: {
        referenceCodeQualifier: string;
        referenceIdentifier: string | undefined;
        referenceVersionIdentifier: string | undefined;
    };
    documentLineIdentifier: string | undefined;
    revisionIdentifier: string | undefined;
}

// RJL

interface AccountingJournalIdentificationData {
    accountingJournalIdentification: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    accountingJournalName: string | undefined;
}

interface AccountingEntryTypeDetails {
    accountingEntryTypeNameCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    accountingEntryTypeName: string | undefined;
}

export interface AccountingJournalIdentification {
    tag: string;

    accountingJournalIdentification:
        | AccountingJournalIdentificationData
        | undefined;
    accountingEntryTypeDetails: AccountingEntryTypeDetails | undefined;
}

// RNG

interface Range {
    measurementUnitCode: string;
    rangeMinimumValue: number | undefined;
    rangeMaximumValue: number | undefined;
}

export interface RangeDetails {
    tag: string;

    rangeTypeCodeQualifier: string;
    range: Range | undefined;
}

// RTE

interface RateDetailsData {
    rateTypeCodeQualifier: string;
    unitPriceBasisRate: number;
    unitPriceBasisValue: number | undefined;
    measurementUnitCode: string | undefined;
}

export interface RateDetails {
    tag: string;

    rateDetails: RateDetailsData;
    statusDescriptionCode: string | undefined;
}

// SEL

interface SealIssuer {
    sealingPartyNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    sealingPartyName: string | undefined;
}

export interface SealNumber {
    tag: string;

    sealIdentifier: string | undefined;
    sealIssuer: SealIssuer | undefined;
    sealConditionCode: string | undefined;
    identityNumberRange: IdentityNumberRange | undefined;
}

// SCC

interface PatternDescription {
    frequencyCode: string | undefined;
    despatchPatternCode: string | undefined;
    despatchPatternTimingCode: string | undefined;
}

export interface SchedulingConditions {
    tag: string;

    deliveryPlanCommitmentLevelCode: string;
    deliveryInstructionCode: string | undefined;
    patternDescription: PatternDescription | undefined;
}

// SEQ

interface SequenceInformation {
    sequencePositionIdentifier: string;
    sequenceIdentifierSoruceCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

export interface SequenceDetails {
    tag: string;

    actionCode: string | undefined;
    sequenceInformation: SequenceInformation | undefined;
}

// SGP

export interface SplitGoodsPlacement {
    tag: string;

    equipmentIdentification: EquipmentIdentification;
    packageQuantity: number | undefined;
}

// STS

interface StatusCategory {
    statusCategoryCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

interface StatusData {
    statusDescriptionCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    statusDescription: string | undefined;
}

interface StatusReason {
    statusReasonDescriptionCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    statusReasonDescription: string | undefined;
}

export interface Status {
    tag: string;

    statusCategory: StatusCategory | undefined;
    status: StatusData | undefined;
    statusReason1: StatusReason | undefined;
    statusReason2: StatusReason | undefined;
    statusReason3: StatusReason | undefined;
    statusReason4: StatusReason | undefined;
    statusReason5: StatusReason | undefined;
}

// TAX

interface DutyTaxOrFeeType {
    dutyTaxOrFeeTypeNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    dutyTaxOrFreeTypeName: string | undefined;
}

interface DutyTaxOrFeeAccountDetail {
    dutyTaxOrFeeTypeNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

interface DutyTaxOrFeeDetail {
    dutyTaxOrFeeRateDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    dutyTaxOrFeeRateDescription: string | undefined;
    dutyTaxOrFeeRateBasisCode: string | undefined;
    codeListIdentificationCode2: string | undefined;
    codeListResponsibleAgencyCode2: string | undefined;
}

export interface TaxDetails {
    tag: string;

    dutyTaxOrFeeFunctionCodeQualifier: string;
    dutyTaxOrFeeType: DutyTaxOrFeeType | undefined;
    dutyTaxOrFeeAcountDetail: DutyTaxOrFeeAccountDetail | undefined;
    dutyTaxOrFreeAssessmentBasisValue: string | undefined;
    dutyTaxOrFeeDetail: DutyTaxOrFeeDetail | undefined;
    dutyTaxOrFeeCategoryCode: string | undefined;
    partyTaxIdentifier: string | undefined;
    calculationSequenceCode: string | undefined;
}

// TDT

interface ModeOfTransport {
    transportModeNameCode: string | undefined;
    transportModeName: string | undefined;
}

interface TransportMeans {
    transportMeansDescriptionCode: string | undefined;
    transportMeansDescription: string | undefined;
}

interface TransportMeansD02b {
    transportMeansDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    transportMeansDescription: string | undefined;
}

interface Carrier {
    carrierIdentifier: string | undefined;
    codeListIdentificationcode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    carrierName: string | undefined;
}

interface ExcessTransportationInformation {
    excessTransportationReasonCode: string;
    excessTransportationResponsibilityCode: string;
    customerShipmentAuthorisationIdentifier: string | undefined;
}

interface TransportIdentification {
    transportMeansIdentificationNameIdentifier: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    transportMeansIdentificationName: string | undefined;
    transportMeansNationalityCode: string | undefined;
}

// since D11a
interface PowerType {
    powerTypeCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    powerTypeDescription: string | undefined;
}

export interface DetailsOfTransport {
    tag: string;

    transportStag: string;
    meansOfTransportJourneyIdentifier: string | undefined;
    modeOfTransport: ModeOfTransport | undefined;
    transportMeans: TransportMeans | undefined;
    carrier: Carrier | undefined;
    transitDirectionIndicatorCode: string | undefined;
    excessTransportationInformation:
        | ExcessTransportationInformation
        | undefined;
    transportIdentification: TransportIdentification | undefined;
    transportMeansOwnershipIndicatorCode: string | undefined;
}

export interface TransportInformationD02b {
    tag: string;

    transportStag: string;
    meansOfTransportJourneyIdentifier: string | undefined;
    modeOfTransport: ModeOfTransport | undefined;
    transportMeans: TransportMeansD02b | undefined;
    carrier: Carrier | undefined;
    transitDirectionIndicatorCode: string | undefined;
    excessTransportationInformation:
        | ExcessTransportationInformation
        | undefined;
    transportIdentification: TransportIdentification | undefined;
    transportMeansOwnershipIndicatorCode: string | undefined;
}

export interface TransportInformationD11a {
    tag: string;

    transportStag: string;
    meansOfTransportJourneyIdentifier: string | undefined;
    modeOfTransport: ModeOfTransport | undefined;
    transportMeans: TransportMeansD02b | undefined;
    carrier: Carrier | undefined;
    transitDirectionIndicatorCode: string | undefined;
    excessTransportationInformation:
        | ExcessTransportationInformation
        | undefined;
    transportIdentification: TransportIdentification | undefined;
    transportMeansOwnershipIndicatorCode: string | undefined;
    powerTypeDescription: PowerType | undefined;
}

// TMD

interface MovementType {
    movementTypeDescriptionCode: string | undefined;
    movementTypeDescription: string | undefined;
}

export interface TransportMovementDetails {
    tag: string;

    movementType: MovementType | undefined;
    equipmentPlanDescription: string | undefined;
    haulageArrangementsCode: string | undefined;
}

// TOD

interface TermsOfDeliveryOrTransportData {
    deliveryOrTransportTermsDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    deliveryOrTransportTermsDescription: string | undefined;
    deliveryOrTransportTermsDescription2: string | undefined;
}

export interface TermsOfDeliveryOrTransport {
    tag: string;

    deliveryOrTransportTermsFunctionCode: string | undefined;
    transportChargesPaymentMethodCode: string | undefined;
    termsOfDeliveryOrTransport: TermsOfDeliveryOrTransportData | undefined;
}

// TSR

interface ContractAndCarriageCondition {
    contractAndCarriageConditionCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

interface Service {
    serviceRequirementCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    serviceRequirementCode2: string | undefined;
    codeListIdentificationCode2: string | undefined;
    codeListResponsibleAgencyCode2: string | undefined;
}

interface TransportPriority {
    transportServicePriorityCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

interface NatureOfCargo {
    cargoTypeinterfaceificationCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
}

export interface TransportServiceRequirements {
    tag: string;

    contractAndCarriageCondition: ContractAndCarriageCondition | undefined;
    service: Service | undefined;
    transportPriority: TransportPriority | undefined;
    natureOfCargo: NatureOfCargo | undefined;
}

// UNH

interface MessageIdentifier {
    messageType: string;
    messageVersionNumber: string;
    messageReleaseNumber: string;
    controllingAgencyCoded: string;
    associationAssignedCode: string | undefined;
    codeListDirectoryVersionNumber: string | undefined;
    messageTypeSubFunctionidentification: string | undefined;
}

interface StatusOfTransfer {
    sequenceOfTransfers: number;
    firstAndLastTransfer: string | undefined;
}

interface MessageSubsetIdentification {
    messageSubsetIdentification: string;
    messageSubsetVersionNumber: string | undefined;
    messageSubsetReleaseNumber: string | undefined;
    controllingAgencyCoded: string | undefined;
}

interface MessageImplementationGuidelineIdentification {
    messageImplementationGuidelineIdentification: string;
    messageImplementationGuidelineVersionNumber: string | undefined;
    messageImplementationGuidelineReleaseNumber: string | undefined;
    controllingAgencyCoded: string | undefined;
}

interface ScenarioIdentification {
    scenarioIdentification: string;
    scenarioVersionNumber: string | undefined;
    scenarioReleaseNumber: string | undefined;
    controllingAgencyCoded: string | undefined;
}

export interface MessageHeader {
    tag: string;

    messageReferenceNumber: string;
    messageIdentifier: MessageIdentifier;
    commonAccessReference: string | undefined;
    statusOfTransfer: StatusOfTransfer | undefined;
    messageSubsetIdentification: MessageSubsetIdentification | undefined;
    messageImplementationGuidelineIdentification:
        | MessageImplementationGuidelineIdentification
        | undefined;
    scenarioIdentification: ScenarioIdentification | undefined;
}

// UNS

export interface SectionControl {
    tag: string;

    sectionIdentification: string;
}

// UNT

export interface MessageTrailer {
    tag: string;

    numberOfSegmentsInAMessage: number;
    messageReferenceNumber: string;
}
