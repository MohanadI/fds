import { DoctorFeatures } from './doctor-feature.model';
import { PatientFeatures } from './patient-feature.model';
import axios from 'axios';

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
    let pateintFeatures: PatientFeatures = this.getPatientFeaturesValues(
      transactionsForPatientML,
      hofSeq,
      subSeq,
      visitSeq,
    );
    let doctorFeatures: DoctorFeatures = this.getDoctorFeaturesValues(
      transactionsForDoctorML,
      hospitalDoctorId,
      hcpId,
    );

    //**************************************** Patient Model **************************************** */

    let patientResult = await axios({
      method: 'POST',
      url: `http://127.0.0.1:9001/predict`,
      data: [pateintFeatures],
    });
    //**************************************** End Patient model **************************************** */

    //**************************************** Doctor model **************************************** */

    let doctorResult = await axios({
      method: 'POST',
      url: `http://127.0.0.1:9002/predict`,
      data: [doctorFeatures],
    });
    //**************************************** End Doctor model **************************************** */
    return {
      patientResult,
      doctorResult,
    };
    // save to predicitons table (visit, sub, doctorClustor, patientCluster, dateCreated)
  }

  getPatientFeaturesValues(
    transactionsForPatientML,
    hofSeq,
    subSeq,
    visitSeq,
  ): PatientFeatures {
    let subscriberActivities = transactionsForPatientML.filter(
      (item) => item.SUBSCRIBER_SEQ_ID == subSeq,
    );
    //calculate patient features
    //*  number of visits per year
    //*     filter for sub_seq and group by visit seq and sub sequence
    let number_of_visit_per_year =
      [...new Set(subscriberActivities.map((item) => item.VISIT_SEQ))].length;

    //*  number of activities per visit
    //*      filter for sub_seq and get avg number of visits
    const subscriberVisits = subscriberActivities.reduce((acc, curr) => {
      if (!acc['a' + curr.VISIT_SEQ]) acc['a' + curr.VISIT_SEQ] = []; //If this type wasn't previously stored
      acc['a' + curr.VISIT_SEQ].push(curr);
      return acc;
    }, {});

    let Avgnumber_of_act =
      subscriberActivities.length / Object.keys(subscriberVisits).length;

    //*  total cost per year
    //*      filter for sub_seq and get total
    let totalCost = subscriberActivities.reduce((acc, curr) => {
      acc += curr.CLAIMED_VALUE;
      return acc;
    }, 0);
    let avgSumClaimPerYear = +totalCost;

    //*  average cost per visit
    //*      filter for sub_seq and get avg cost of visits
    let avgSumClaimPerVisit = totalCost / Object.keys(subscriberVisits).length;

    //*  avg count of occurences for THR_CODE
    //*      filter for sub_seq and count each THR_code and get max

    const thrCodes = subscriberActivities.reduce((acc, curr) => {
      if (curr.THR_CODE) {
        if (!acc[curr.THR_CODE]) acc[curr.THR_CODE] = []; //If this type wasn't previously stored
        acc[curr.THR_CODE].push(curr);
      }
      return acc;
    }, {});
    let ThrCodeMax = 0;
    for (const key in thrCodes) {
      if (Object.prototype.hasOwnProperty.call(thrCodes, key)) {
        const element = thrCodes[key];
        ThrCodeMax = Math.max(element.length, ThrCodeMax);
      }
    }
    ThrCodeMax = +ThrCodeMax;

    //*  الفرق الزمني بين الزيارات لنفس العائله
    //*      group by visit(sub and visit) and order it and then calulate avg of differences

    const hofVisits = subscriberActivities.reduce((acc, curr) => {
      let hofKey = 'v' + curr.VISIT_SEQ + 's' + curr.SUBSCRIBER_SEQ_ID;
      if (!acc[hofKey]) acc[hofKey] = []; //If this type wasn't previously stored
      acc[hofKey].push(curr);
      return acc;
    }, {});
    let timediff = 0;
    let prevDateCreated = 0;
    for (let key in hofVisits) {
      let dateCreated = hofVisits[key][0].DATE_CREATED;
      if (prevDateCreated) {
        let millis =
          new Date(dateCreated).getTime() - new Date(prevDateCreated).getTime();
        timediff += Math.floor(millis / 60 / 60 / 24);
      }
      prevDateCreated = dateCreated;
    }
    let avgTimeDiff = 365;
    if (hofVisits.length > 1) {
      avgTimeDiff = timediff / (hofVisits.length - 1);
    }

    //*  عدد الزيارات نفس العائله لنفس الدكتور
    //*      group by visit(sub and visit) and then count for each doctor and get max
    let doctorVisits: any = {};
    for (let key in hofVisits) {
      let doctorActivity = hofVisits[key].find((item) => {
        return ['Emergency Center', 'Doctor'].indexOf(item.HCP_Type) >= 0;
      });
      if (doctorActivity) {
        let hcpKey =
          'l' + doctorActivity.HOSPITAL_DOCTOR_ID + 'p' + doctorActivity.HCP_ID;
        if (!doctorVisits[hcpKey]) doctorVisits[hcpKey] = []; //If this type wasn't previously stored
        doctorVisits[hcpKey].push(doctorActivity);
      }
    }

    let doctorVisitsMax = 0;
    for (const key in doctorVisits) {
      if (Object.prototype.hasOwnProperty.call(doctorVisits, key)) {
        const element = doctorVisits[key];
        doctorVisitsMax = Math.max(element.length, doctorVisitsMax);
      }
    }
    let maxSUBVisitsSameDoctor = +doctorVisitsMax;

    //*  isWestbank or Gaza
    //*      simple for last visit for the subscriber
    let CITY =
      ['Khan Yunis', 'Deir Al Balah', 'Rafah', 'Gaza'].indexOf(
        transactionsForPatientML[0].CITY,
      ) >= 0
        ? 0
        : 1;

    //*  AGE
    //*      simple for last visit for the subscriber
    let AGE = transactionsForPatientML[0].AGE;

    return {
      number_of_visit_per_year,
      Avgnumber_of_act,
      avgSumClaimPerYear,
      avgSumClaimPerVisit,
      ThrCodeMax,
      avgTimeDiff,
      maxSUBVisitsSameDoctor,
      CITY,
      AGE,
    };
  }

  getDoctorFeaturesValues(
    transactionsForDoctorML,
    hospitalDoctorId,
    hcpId,
  ): DoctorFeatures {
    // calculate doctor features
    //
    // *   avg count of occurences for THR_CODE
    // *      filter for HospitalDoctorId and HCP_ID and count each THR_code and get max
    const thrCodes = transactionsForDoctorML.reduce((acc, curr) => {
      if (curr.THR_CODE) {
        if (!acc[curr.THR_CODE]) acc[curr.THR_CODE] = []; //If this type wasn't previously stored
        acc[curr.THR_CODE].push(curr);
      }
      return acc;
    }, {});
    let ThrCodeMax = 0;
    for (const key in thrCodes) {
      if (Object.prototype.hasOwnProperty.call(thrCodes, key)) {
        const element = thrCodes[key];
        ThrCodeMax = Math.max(element.length, ThrCodeMax);
      }
    }
    ThrCodeMax = +ThrCodeMax;

    // *   number of activities per visit
    // *      filter for HospitalDoctorId and HcpId and get avg number of visits

    const subscriberVisits = transactionsForDoctorML.reduce((acc, curr) => {
      let visitKey = 'v' + curr.VISIT_SEQ + 's' + curr.SUBSCRIBER_SEQ_ID;
      if (!acc[visitKey]) acc[visitKey] = []; //If this type wasn't previously stored
      acc[visitKey].push(curr);
      return acc;
    }, {});
    let Avgnumber_of_act =
      transactionsForDoctorML.length / Object.keys(subscriberVisits).length;

    // *   average cost per visit
    // *       filter for HospitalDoctorId and HcpId and get avg cost of visits

    let totalCost = transactionsForDoctorML.reduce((acc, curr) => {
      acc += curr.CLAIMED_VALUE;
      return acc;
    }, 0);
    let avgSumClaim = totalCost / Object.keys(subscriberVisits).length;

    // *   avg visits per year
    // *       filter for HospitalDoctorId and HcpId and group by visit seq and subSequenceId
    let max_Doctor_visit_peryear = Object.keys(subscriberVisits).length;

    // *   avg count of medicines prescriped by doctor per visit (pharmacy)
    // *       group by visit(sub and visit) and filter for pharmacy only and get avg
    let pharmacyActivites = transactionsForDoctorML.filter((item) => {
      return item.HCP_Type === 'Pharmacy';
    });
    let medAvg =
      pharmacyActivites.length / Object.keys(subscriberVisits).length;

    // *   avg cost for doctor per patient(not visit)
    // *       ['HCP Type'] == 'Emergency Center' || ['HCP Type'] == 'Doctor', then group by Subscriber and sum for each one  then get the mean for each one
    let doctorProcedures = transactionsForDoctorML.filter((item) => {
      return ['Emergency Center', 'Doctor'].indexOf(item.HCP_Type) >= 0;
    });
    let numberOfSubscribers = [
      ...new Set(doctorProcedures.map((item) => item.SUBSCRIBER_SEQ_ID)),
    ].length;
    let totalCostOfDoctorProcedures = doctorProcedures.reduce((acc, curr) => {
      acc += curr.CLAIMED_VALUE;
      return acc;
    }, 0);
    let avgSubscriberDoctorCost = 0;
    if (numberOfSubscribers) {
      avgSubscriberDoctorCost =
        totalCostOfDoctorProcedures / numberOfSubscribers;
    }

    return {
      ThrCodeMax,
      Avgnumber_of_act,
      avgSumClaim,
      max_Doctor_visit_peryear,
      medAvg,
      avgSubscriberDoctorCost,
    };
  }
}
