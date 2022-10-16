"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSchema = void 0;
const mongoose = require("mongoose");
exports.TransactionSchema = new mongoose.Schema({
    EP_MAN_ICO_ID: String,
    EFFECTIVE_DATE: String,
    EXPIRATION_DATE: String,
    HCP_ID: String,
    HOSPITAL_DOCTOR_ID: String,
    CLAIMING_HCP_ID: String,
    VISIT_DATE: String,
    VISIT_SEQ: String,
    CLAIM_PAYMENT_TYPE: String,
    PAYMENT_TYPE: String,
    HCP_TYPE_ID: String,
    HCP_Type: String,
    TPYE_OF_VISIT_ID: String,
    Type: String,
    CODE: String,
    CHAPTER: String,
    CODE_1: String,
    SECTIONS: String,
    ICD9_CODE: String,
    ICD_9_Description: String,
    ICD_9_Description_ar: String,
    DOCTOR_ID: String,
    SPECIALITY_ID: String,
    DOCTOR_SPECIALITY: String,
    SPECIALITY_ID_1: String,
    DESCRIPTION: String,
    GENDER_ID: String,
    Gender: String,
    DEPENDENT_CODE: String,
    AGE: String,
    SUBSCRIBER_SEQ_ID: String,
    HOF_SEQ_ID: String,
    DEPENDANCE: String,
    CLAIMED_ITEM: String,
    ID: String,
    MANUFACTURERS_ID: String,
    THR_CODE: String,
    THR_NAME: String,
    BRAND_ID: String,
    BRAND: String,
    FORM_ID: String,
    FORM: String,
    SKU_ID: String,
    size: String,
    UNIT_TYPE: String,
    TOTAL_QTY: String,
    DOSAGEAGE: String,
    UNIT_TYPE_ID: String,
    EP_MDC_CPT_CODE: String,
    CITY_CODE: String,
    CITY: String,
    DATE_CREATED: String,
    CLAIMED_VALUE: String
});
//# sourceMappingURL=transaction.schema.js.map