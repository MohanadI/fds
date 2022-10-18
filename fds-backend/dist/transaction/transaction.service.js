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
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const moment = require("moment");
const mongoose_2 = require("@nestjs/mongoose");
let TransactionService = class TransactionService {
    constructor(transactionModel) {
        this.transactionModel = transactionModel;
    }
    async addTransaction(createTransactionDTO) {
        const newTransaction = await new this.transactionModel(createTransactionDTO);
        return newTransaction.save();
    }
    async getTransaction(transactionID) {
        const transaction = await this.transactionModel
            .findById(transactionID)
            .exec();
        return transaction;
    }
    async getTransactionBySubscriberSeqIDAndVisitSeq(SUBSCRIBER_SEQ_ID, VISIT_SEQ) {
        const transactions = await this.transactionModel
            .find()
            .where({
            SUBSCRIBER_SEQ_ID,
            VISIT_SEQ,
        })
            .exec();
        return transactions;
    }
    async getTransactionsBySubscriberSeqID(SUBSCRIBER_SEQ_ID) {
        const transactions = await this.transactionModel
            .find({ SUBSCRIBER_SEQ_ID: SUBSCRIBER_SEQ_ID })
            .limit(1)
            .exec();
        return transactions;
    }
    async getTransactionsByHOFSeqID(HOF_SEQ_ID) {
        const oneYearAgo = moment()
            .subtract(1, 'years')
            .format('DD/MM/YY HH:MM');
        const transactions = await this.transactionModel
            .find({
            VISIT_DATE: { $gte: oneYearAgo },
            HOF_SEQ_ID: HOF_SEQ_ID,
        })
            .exec();
        return transactions;
    }
    async getTransactionsByDoctorID(HOSPITAL_DOCTOR_ID, HCP_ID) {
        const oneYearAgo = moment()
            .subtract(1, 'years')
            .format('DD/MM/YY HH:MM');
        const transactions = await this.transactionModel
            .find({
            VISIT_DATE: { $gte: oneYearAgo },
            HOSPITAL_DOCTOR_ID: HOSPITAL_DOCTOR_ID,
            HCP_ID: HCP_ID,
        })
            .exec();
        return transactions;
    }
    async getTransactions() {
        const transactions = await this.transactionModel
            .find()
            .sort({
            VISIT_DATE: -1,
        })
            .limit(1000)
            .exec();
        return transactions;
    }
    async replaceDate() {
        const transactions = await this.transactionModel
            .find()
            .updateMany({}, [
            {
                $set: {
                    VISIT_DATE: { $dateFromString: { dateString: "$VISIT_DATE", format: "%d/%m/%Y" } },
                }
            }
        ])
            .exec();
    }
    async editTransaction(transactionID, createTransactionDTO) {
        const editedTransaction = await this.transactionModel.findByIdAndUpdate(transactionID, createTransactionDTO, { new: true });
        return editedTransaction;
    }
    async deleteTransaction(transactionID) {
        const deletedTransaction = await this.transactionModel.findByIdAndRemove(transactionID);
        return deletedTransaction;
    }
};
TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Transaction')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], TransactionService);
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map