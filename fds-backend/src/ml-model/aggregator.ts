import { DoctorFeatures } from './doctor-feature.model';
import { PatientFeatures } from './patient-feature.model';

export class Aggregator {
  constructor() {}

  async getMLPrediction(
    hofSeq,
    subSeq,
    visitSeq,
    hospitalDoctorId,
    hcpId,
    transactionsForPatientML,
    transactionsForDoctorML,
  ) {
    let pateintFeatures: PatientFeatures = await this.getPatientFeaturesValues(
      hofSeq,
      subSeq,
      visitSeq,
    );
    let doctorFeatures: DoctorFeatures = await this.getDoctorFeaturesValues(
      hospitalDoctorId,
      hcpId,
    );

    //**************************************** Patient Model **************************************** */
    console.log(transactionsForPatientML);
    // call patient AI api
    //127.0.0.1:9001/predict
    /**
            "ThrCodeMax"
            "AGE"
            "CITY"
            "maxSUBVisitsSameDoctor"
            "number_of_visit_per_year"
            "Avgnumber_of_act"
            "avgSumClaimPerYear"
            "avgSumClaimPerVisit"
            "avgTimeDiff"
        */
    /**
        * response: {
                "prediction": "[2]"
            }
        */
    //**************************************** End Patient model **************************************** */

    //**************************************** Doctor model **************************************** */
    console.log(transactionsForDoctorML);
    // call doctor AI api
    //127.0.0.1:9002/predict
    /**
            ThrCodeMax
            Avgnumber_of_act
            avgSumClaim
            max_Doctor_visit_peryear
            medAvg
            avgSubscriberDoctorCost
         */
    /**
        * response: {
                "prediction": "[2]"
            }
        */
    //**************************************** End Doctor model **************************************** */

    // save to predicitons table (visit, sub, doctorClustor, patientCluster, dateCreated)
  }

  async getPatientFeaturesValues(hofSeq, subSeq, visitSeq) {
    //calculate patient features
    /**
     * query to get last month  min and max date for HOF sequence
     *  number of visits per year
     *     filter for sub_seq and group by visit seq and sub sequence * 12
     *  number of activities per visit
     *      filter for sub_seq and get avg number of visits
     *  total cost per year
     *      filter for sub_seq and get total * 12
     *  average cost per visit
     *      filter for sub_seq and get avg cost of visits
     *  avg count of occurences for THR_CODE
     *      filter for sub_seq and count each THR_code and get max * 12
     *  الفرق الزمني بين الزيارات لنفس العائله
     *      group by visit(sub and visit) and order it and then calulate avg of differences
     *  عدد الزيارات نفس العائله لنفس الدكتور
     *      group by visit(sub and visit) and then count for each doctor and get max
     *  isWestbank or Gaza
     *      simple for last visit for the subscriber
     *  AGE
     *      simple for last visit for the subscriber
     */
    return new PatientFeatures();
  }

  getDoctorFeaturesValues(hospitalDoctorId, hcpId) {
    // calculate doctor features
    /**
     *   avg count of occurences for THR_CODE
     *      filter for HospitalDoctorId and HCP_ID and count each THR_code and get max * 12
     *   number of activities per visit
     *      filter for HospitalDoctorId and HcpId and get avg number of visits
     *   average cost per visit
     *       filter for HospitalDoctorId and HcpId and get avg cost of visits
     *   avg visits per year
     *       filter for HospitalDoctorId and HcpId and group by visit seq and subSequenceId * 12
     *   avg count of medicines prescriped by doctor per visit (pharmacy)
     *       group by visit(sub and visit) and filter for pharmacy only and get avg
     *   avg cost for doctor per patient(not visit)
     *       ['HCP Type'] == 'Emergency Center' || ['HCP Type'] == 'Doctor', then group by Subscriber and sum for each one  then get the mean for each one
     */
    return new DoctorFeatures();
  }
}
