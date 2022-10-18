"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionSchema = void 0;
const mongoose = require("mongoose");
exports.PredictionSchema = new mongoose.Schema({
    SUBSCRIBER_SEQ_ID: String,
    VISIT_SEQ: String,
    DOCTOR_CLUSTER: String,
    PATIENT_CLUSTER: String,
    DOCTOR_CLUSTER_PREDICTION: String,
    PATIENT_CLUSTER_PREDICTION: String,
    VISIT_DATE: Date,
});
//# sourceMappingURL=prediction.schema.js.map