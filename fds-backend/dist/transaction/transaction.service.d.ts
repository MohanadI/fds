import { Model } from 'mongoose';
import { Transaction } from './interfaces/transaction.interface';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
export declare class TransactionService {
    private readonly transactionModel;
    constructor(transactionModel: Model<Transaction>);
    addTransaction(createTransactionDTO: CreateTransactionDTO): Promise<Transaction>;
    getTransaction(transactionID: any): Promise<Transaction>;
    getTransactionBySubscriberSeqIDAndVisitSeq(SUBSCRIBER_SEQ_ID: any, VISIT_SEQ: any): Promise<Transaction[]>;
    getTransactionsBySubscriberSeqID(SUBSCRIBER_SEQ_ID: any): Promise<any[]>;
    getTransactionsByHOFSeqID(HOF_SEQ_ID: any): Promise<any[]>;
    getTransactionsByDoctorID(HOSPITAL_DOCTOR_ID: any, HCP_ID: any): Promise<any[]>;
    getTransactions(): Promise<Transaction[]>;
    replaceDate(): Promise<any>;
    editTransaction(transactionID: any, createTransactionDTO: CreateTransactionDTO): Promise<Transaction>;
    deleteTransaction(transactionID: any): Promise<any>;
}
