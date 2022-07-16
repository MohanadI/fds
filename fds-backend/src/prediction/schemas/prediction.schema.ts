import * as mongoose from 'mongoose';

export const PredictionSchema = new mongoose.Schema({
  SUBSCRIBER_SEQ_ID: String,
  VISIT_SEQ: String,
  DOCTOR_CLUSTER: String,
  PATIENT_CLUSTER: String,
  DOCTOR_CLUSTER_PREDICTION: String,
  PATIENT_CLUSTER_PREDICTION: String,
  DATE_CREATED: String,
});
