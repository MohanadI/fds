import { Document } from 'mongoose';

export interface Prediction extends Document {
  readonly SUBSCRIBER_SEQ_ID: String;
  readonly VISIT_SEQ: String;
  readonly DOCTOR_CLUSTER: String;
  readonly PATIENT_CLUSTER: String;
  readonly DOCTOR_CLUSTER_PREDICTION: String;
  readonly PATIENT_CLUSTER_PREDICTION: String;
  readonly VISIT_DATE: Date;
}
