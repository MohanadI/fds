import { DoctorFeatures } from './doctor-feature.model';
import { PatientFeatures } from './patient-feature.model';
export declare class Aggregator {
    constructor();
    getMLPrediction(hofSeq: any, subSeq: any, visitSeq: any, hospitalDoctorId: any, hcpId: any, transactionsForPatientML: any, transactionsForDoctorML: any): Promise<{
        patientResult: import("axios").AxiosResponse<any, any>;
        doctorResult: import("axios").AxiosResponse<any, any>;
    }>;
    getPatientFeaturesValues(transactionsForPatientML: any, hofSeq: any, subSeq: any, visitSeq: any): PatientFeatures;
    getDoctorFeaturesValues(transactionsForDoctorML: any, hospitalDoctorId: any, hcpId: any): DoctorFeatures;
}
