"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("./transaction.service");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
const validate_object_id_pipes_1 = require("../shared/pipes/validate-object-id.pipes");
const aggregator_1 = require("../ml-model/aggregator");
const prediction_service_1 = require("../prediction/prediction.service");
const moment = require("moment");
let TransactionController = class TransactionController {
    constructor(TransactionService, PredictionService) {
        this.TransactionService = TransactionService;
        this.PredictionService = PredictionService;
    }
    async addTransaction(res, createTransactionDTO) {
        var _a, _b, _c, _d;
        for (let i = 0; i < createTransactionDTO.length; i++) {
            await this.TransactionService.addTransaction(createTransactionDTO[i]);
        }
        const result = createTransactionDTO.reduce(function (r, a) {
            r[a.VISIT_SEQ + '_' + a.SUBSCRIBER_SEQ_ID] = r[a.VISIT_SEQ + '_' + a.SUBSCRIBER_SEQ_ID] || [];
            r[a.VISIT_SEQ + '_' + a.SUBSCRIBER_SEQ_ID].push(a);
            return r;
        }, Object.create(null));
        for (let key in result) {
            let transActivitiesList = result[key];
            const { HOF_SEQ_ID, SUBSCRIBER_SEQ_ID, VISIT_SEQ, HOSPITAL_DOCTOR_ID, HCP_ID, VISIT_DATE, } = transActivitiesList[0];
            const transactionsForPatientML = await this.TransactionService.getTransactionsByHOFSeqID(HOF_SEQ_ID);
            const transactionsForDoctorML = await this.TransactionService.getTransactionsByDoctorID(HOSPITAL_DOCTOR_ID, HCP_ID);
            const newAggregator = new aggregator_1.Aggregator();
            const predictions = await newAggregator.getMLPrediction(HOF_SEQ_ID, SUBSCRIBER_SEQ_ID, VISIT_SEQ, HOSPITAL_DOCTOR_ID, HCP_ID, transactionsForPatientML, transactionsForDoctorML);
            const patientCluster = (_b = (_a = predictions.patientResult) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.cluster;
            const doctorCluster = (_d = (_c = predictions.doctorResult) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.cluster;
            const patientPrediction = patientCluster === '1'
                ? 'Fraud'
                : patientCluster === '2'
                    ? 'Abuse'
                    : patientCluster === '6'
                        ? 'Waste'
                        : 'Normal';
            const doctorPrediction = doctorCluster === '5'
                ? 'Fraud'
                : patientCluster === '3'
                    ? 'Abuse'
                    : patientCluster === '4'
                        ? 'Waste'
                        : 'Normal';
            const predictionToInsert = {
                SUBSCRIBER_SEQ_ID: SUBSCRIBER_SEQ_ID,
                VISIT_SEQ: VISIT_SEQ,
                DOCTOR_CLUSTER: doctorCluster,
                PATIENT_CLUSTER: patientCluster,
                DOCTOR_CLUSTER_PREDICTION: doctorPrediction,
                PATIENT_CLUSTER_PREDICTION: patientPrediction,
                VISIT_DATE: VISIT_DATE,
            };
            console.log(' --------------------- ');
            console.log(predictionToInsert);
            console.log(' --------------------- ');
            let predictionExists = await this.PredictionService.getPredictionBySubAndVisit(SUBSCRIBER_SEQ_ID, VISIT_SEQ);
            if (predictionExists && predictionExists.length) {
                await this.PredictionService.editPrediction(predictionExists[0]._id, predictionToInsert);
            }
            else {
                await this.PredictionService.addPrediction(predictionToInsert);
            }
        }
        return res.status(common_1.HttpStatus.OK).json({
            message: 'Transaction has been submitted successfully!',
            transaction: {},
        });
    }
    async getTransaction(res, transactionID) {
        const transaction = await this.TransactionService.getTransaction(transactionID);
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction does not exist!');
        }
        return res.status(common_1.HttpStatus.OK).json(transaction);
    }
    async getTransactionBySubscriberSeqIDAndVisitSeq(res, SUBSCRIBER_SEQ_ID, VISIT_SEQ) {
        const transaction = await this.TransactionService.getTransactionBySubscriberSeqIDAndVisitSeq(SUBSCRIBER_SEQ_ID, VISIT_SEQ);
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction does not exist!');
        }
        return res.status(common_1.HttpStatus.OK).json(transaction);
    }
    async getPredictionBySubscriberSeqIDAndVisitSeq(res, SUBSCRIBER_SEQ_ID, VISIT_SEQ) {
        const transaction = await this.TransactionService.getTransactionBySubscriberSeqIDAndVisitSeq(SUBSCRIBER_SEQ_ID, VISIT_SEQ);
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction does not exist!');
        }
        this.addPredictTransaction(res, transaction);
    }
    async getTransactions(res) {
        const transactions = await this.TransactionService.getTransactions();
        return res.status(common_1.HttpStatus.OK).json(transactions);
    }
    async getTransactionsBySubscriberSeqID(res, SUBSCRIBER_SEQ_ID) {
        const transactions = await this.TransactionService.getTransactionsBySubscriberSeqID(SUBSCRIBER_SEQ_ID);
        return res.status(common_1.HttpStatus.OK).json(transactions);
    }
    async editTransaction(res, transactionID, createTransactionDTO) {
        const editedTransaction = await this.TransactionService.editTransaction(transactionID, createTransactionDTO);
        if (!editedTransaction) {
            throw new common_1.NotFoundException('Transaction does not exist!');
        }
        return res.status(common_1.HttpStatus.OK).json({
            message: 'Transaction has been successfully updated',
            transaction: editedTransaction,
        });
    }
    async deleteTransaction(res, transactionID) {
        const deletedTransaction = await this.TransactionService.deleteTransaction(transactionID);
        if (!deletedTransaction) {
            throw new common_1.NotFoundException('Transaction does not exist!');
        }
        return res.status(common_1.HttpStatus.OK).json({
            message: 'Transaction has been deleted!',
            transaction: deletedTransaction,
        });
    }
    async addPredictTransaction(res, createTransactionDTO) {
        var _a, _b, _c, _d;
        for (let i = 0; i < createTransactionDTO.length; i++) {
            createTransactionDTO[i]['EFFECTIVE_DATE'] = moment(createTransactionDTO[i]['EFFECTIVE_DATE'], "MM/DD/YYYY").toDate();
            createTransactionDTO[i]['EXPIRATION_DATE'] = moment(createTransactionDTO[i]['EXPIRATION_DATE'], "MM/DD/YYYY").toDate();
            createTransactionDTO[i]['VISIT_DATE'] = moment(createTransactionDTO[i]['VISIT_DATE'], "DD/MM/YYYY").toDate();
            createTransactionDTO[i]['DATE_CREATED'] = moment(createTransactionDTO[i]['DATE_CREATED'], "MM/DD/YYYY HH:mm").toDate();
        }
        const result = createTransactionDTO.reduce(function (r, a) {
            r[a.VISIT_SEQ + '_' + a.SUBSCRIBER_SEQ_ID] = r[a.VISIT_SEQ + '_' + a.SUBSCRIBER_SEQ_ID] || [];
            r[a.VISIT_SEQ + '_' + a.SUBSCRIBER_SEQ_ID].push(a);
            return r;
        }, Object.create(null));
        let predictionsResult = [];
        for (let key in result) {
            let transActivitiesList = result[key];
            const { HOF_SEQ_ID, SUBSCRIBER_SEQ_ID, VISIT_SEQ, HOSPITAL_DOCTOR_ID, HCP_ID, VISIT_DATE, } = transActivitiesList[0];
            const transactionsForPatientML = await this.TransactionService.getTransactionsByHOFSeqID(HOF_SEQ_ID);
            const transactionsForDoctorML = await this.TransactionService.getTransactionsByDoctorID(HOSPITAL_DOCTOR_ID, HCP_ID);
            const newAggregator = new aggregator_1.Aggregator();
            const predictions = await newAggregator.getMLPrediction(HOF_SEQ_ID, SUBSCRIBER_SEQ_ID, VISIT_SEQ, HOSPITAL_DOCTOR_ID, HCP_ID, transactionsForPatientML, transactionsForDoctorML);
            const patientCluster = (_b = (_a = predictions.patientResult) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.cluster;
            const doctorCluster = (_d = (_c = predictions.doctorResult) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.cluster;
            const patientPrediction = patientCluster === '1'
                ? 'Fraud'
                : patientCluster === '2'
                    ? 'Abuse'
                    : patientCluster === '6'
                        ? 'Waste'
                        : 'Normal';
            const doctorPrediction = doctorCluster === '5'
                ? 'Fraud'
                : patientCluster === '3'
                    ? 'Abuse'
                    : patientCluster === '4'
                        ? 'Waste'
                        : 'Normal';
            const predictionToInsert = {
                SUBSCRIBER_SEQ_ID: SUBSCRIBER_SEQ_ID,
                VISIT_SEQ: VISIT_SEQ,
                DOCTOR_CLUSTER: doctorCluster,
                PATIENT_CLUSTER: patientCluster,
                DOCTOR_CLUSTER_PREDICTION: doctorPrediction,
                PATIENT_CLUSTER_PREDICTION: patientPrediction,
                VISIT_DATE: VISIT_DATE,
            };
            predictionsResult.push(predictionToInsert);
            console.log(' --------------------- ');
            console.log(predictionToInsert);
            console.log(' --------------------- ');
            let predictionExists = await this.PredictionService.getPredictionBySubAndVisit(SUBSCRIBER_SEQ_ID, VISIT_SEQ);
            if (predictionExists && predictionExists.length) {
                await this.PredictionService.editPrediction(predictionExists[0]._id, predictionToInsert);
            }
            else {
                await this.PredictionService.addPrediction(predictionToInsert);
            }
        }
        return res.status(common_1.HttpStatus.OK).json({
            message: 'Transaction has been submitted successfully!',
            transaction: createTransactionDTO,
            predictions: predictionsResult
        });
    }
};
__decorate([
    (0, common_1.Post)('/transaction'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "addTransaction", null);
__decorate([
    (0, common_1.Get)('transaction/:transactionID'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('transactionID', new validate_object_id_pipes_1.ValidateObjectId())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransaction", null);
__decorate([
    (0, common_1.Get)('transactionsBySSIAndVI/:SUBSCRIBER_SEQ_ID/:VISIT_SEQ'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('SUBSCRIBER_SEQ_ID')),
    __param(2, (0, common_1.Param)('VISIT_SEQ')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactionBySubscriberSeqIDAndVisitSeq", null);
__decorate([
    (0, common_1.Get)('getPredictionBySubscriberSeqIDAndVisitSeq/:SUBSCRIBER_SEQ_ID/:VISIT_SEQ'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('SUBSCRIBER_SEQ_ID')),
    __param(2, (0, common_1.Param)('VISIT_SEQ')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getPredictionBySubscriberSeqIDAndVisitSeq", null);
__decorate([
    (0, common_1.Get)('transactions'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)('transactionsBySSI/:subscriberSeqID'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('subscriberSeqID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactionsBySubscriberSeqID", null);
__decorate([
    (0, common_1.Put)('/edit'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('transactionID', new validate_object_id_pipes_1.ValidateObjectId())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_transaction_dto_1.CreateTransactionDTO]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "editTransaction", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('transactionID', new validate_object_id_pipes_1.ValidateObjectId())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "deleteTransaction", null);
__decorate([
    (0, common_1.Post)('/predict-transaction'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "addPredictTransaction", null);
TransactionController = __decorate([
    (0, common_1.Controller)('transaction'),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService,
        prediction_service_1.PredictionService])
], TransactionController);
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction.controller.js.map