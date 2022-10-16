import * as mongoose from 'mongoose';
export declare const PredictionSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, any, {}, "type", {
    VISIT_SEQ?: string;
    SUBSCRIBER_SEQ_ID?: string;
    DATE_CREATED?: string;
    DOCTOR_CLUSTER?: string;
    PATIENT_CLUSTER?: string;
    DOCTOR_CLUSTER_PREDICTION?: string;
    PATIENT_CLUSTER_PREDICTION?: string;
}>;
