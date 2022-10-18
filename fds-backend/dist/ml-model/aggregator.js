"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aggregator = void 0;
const axios_1 = require("axios");
class Aggregator {
    constructor() { }
    async getMLPrediction(hofSeq, subSeq, visitSeq, hospitalDoctorId, hcpId, transactionsForPatientML, transactionsForDoctorML) {
        let pateintFeatures = this.getPatientFeaturesValues(transactionsForPatientML, hofSeq, subSeq, visitSeq);
        let doctorFeatures = this.getDoctorFeaturesValues(transactionsForDoctorML, hospitalDoctorId, hcpId);
        let patientResult = await (0, axios_1.default)({
            method: 'POST',
            url: `http://127.0.0.1:9001/predict`,
            data: [pateintFeatures],
        });
        let doctorResult = await (0, axios_1.default)({
            method: 'POST',
            url: `http://127.0.0.1:9002/predict`,
            data: [doctorFeatures],
        });
        return {
            patientResult,
            doctorResult,
        };
    }
    getPatientFeaturesValues(transactionsForPatientML, hofSeq, subSeq, visitSeq) {
        let subscriberActivities = transactionsForPatientML.filter((item) => item.SUBSCRIBER_SEQ_ID == subSeq);
        let number_of_visit_per_year = [...new Set(subscriberActivities.map((item) => item.VISIT_SEQ))].length;
        const subscriberVisits = subscriberActivities.reduce((acc, curr) => {
            if (!acc['a' + curr.VISIT_SEQ])
                acc['a' + curr.VISIT_SEQ] = [];
            acc['a' + curr.VISIT_SEQ].push(curr);
            return acc;
        }, {});
        let Avgnumber_of_act = subscriberActivities.length / Object.keys(subscriberVisits).length;
        let totalCost = subscriberActivities.reduce((acc, curr) => {
            acc += curr.CLAIMED_VALUE;
            return acc;
        }, 0);
        let avgSumClaimPerYear = +totalCost;
        let avgSumClaimPerVisit = totalCost / Object.keys(subscriberVisits).length;
        const thrCodes = subscriberActivities.reduce((acc, curr) => {
            if (curr.THR_CODE) {
                if (!acc[curr.THR_CODE])
                    acc[curr.THR_CODE] = [];
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
        const hofVisits = subscriberActivities.reduce((acc, curr) => {
            let hofKey = 'v' + curr.VISIT_SEQ + 's' + curr.SUBSCRIBER_SEQ_ID;
            if (!acc[hofKey])
                acc[hofKey] = [];
            acc[hofKey].push(curr);
            return acc;
        }, {});
        let timediff = 0;
        let prevDateCreated = 0;
        for (let key in hofVisits) {
            let dateCreated = hofVisits[key][0].VISIT_DATE;
            if (prevDateCreated) {
                let millis = new Date(dateCreated).getTime() - new Date(prevDateCreated).getTime();
                timediff += Math.floor(millis / 60 / 60 / 24);
            }
            prevDateCreated = dateCreated;
        }
        let avgTimeDiff = 365;
        if (hofVisits.length > 1) {
            avgTimeDiff = timediff / (hofVisits.length - 1);
        }
        let doctorVisits = {};
        for (let key in hofVisits) {
            let doctorActivity = hofVisits[key].find((item) => {
                return ['Emergency Center', 'Doctor'].indexOf(item.HCP_Type) >= 0;
            });
            if (doctorActivity) {
                let hcpKey = 'l' + doctorActivity.HOSPITAL_DOCTOR_ID + 'p' + doctorActivity.HCP_ID;
                if (!doctorVisits[hcpKey])
                    doctorVisits[hcpKey] = [];
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
        let CITY = ['Khan Yunis', 'Deir Al Balah', 'Rafah', 'Gaza'].indexOf(transactionsForPatientML[0].CITY) >= 0
            ? 0
            : 1;
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
    getDoctorFeaturesValues(transactionsForDoctorML, hospitalDoctorId, hcpId) {
        const thrCodes = transactionsForDoctorML.reduce((acc, curr) => {
            if (curr.THR_CODE) {
                if (!acc[curr.THR_CODE])
                    acc[curr.THR_CODE] = [];
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
        const subscriberVisits = transactionsForDoctorML.reduce((acc, curr) => {
            let visitKey = 'v' + curr.VISIT_SEQ + 's' + curr.SUBSCRIBER_SEQ_ID;
            if (!acc[visitKey])
                acc[visitKey] = [];
            acc[visitKey].push(curr);
            return acc;
        }, {});
        let Avgnumber_of_act = transactionsForDoctorML.length / Object.keys(subscriberVisits).length;
        let totalCost = transactionsForDoctorML.reduce((acc, curr) => {
            acc += curr.CLAIMED_VALUE;
            return acc;
        }, 0);
        let avgSumClaim = totalCost / Object.keys(subscriberVisits).length;
        let max_Doctor_visit_peryear = Object.keys(subscriberVisits).length;
        let pharmacyActivites = transactionsForDoctorML.filter((item) => {
            return item.HCP_Type === 'Pharmacy';
        });
        let medAvg = pharmacyActivites.length / Object.keys(subscriberVisits).length;
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
exports.Aggregator = Aggregator;
//# sourceMappingURL=aggregator.js.map