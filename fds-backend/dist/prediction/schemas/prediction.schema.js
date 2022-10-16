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
    DATE_CREATED: String,
});
//# sourceMappingURL=prediction.schema.js.map