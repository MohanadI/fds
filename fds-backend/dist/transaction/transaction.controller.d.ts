import { TransactionService } from './transaction.service';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { PredictionService } from 'src/prediction/prediction.service';
export declare class TransactionController {
    private TransactionService;
    private PredictionService;
    constructor(TransactionService: TransactionService, PredictionService: PredictionService);
    addTransaction(res: any, createTransactionDTO: CreateTransactionDTO[]): Promise<any>;
    getTransaction(res: any, transactionID: any): Promise<any>;
    getTransactionBySubscriberSeqIDAndVisitSeq(res: any, SUBSCRIBER_SEQ_ID: any, VISIT_SEQ: any): Promise<any>;
    getPredictionBySubscriberSeqIDAndVisitSeq(res: any, SUBSCRIBER_SEQ_ID: any, VISIT_SEQ: any): Promise<void>;
    getTransactions(res: any): Promise<any>;
    getTransactionsBySubscriberSeqID(res: any, SUBSCRIBER_SEQ_ID: any): Promise<any>;
    editTransaction(res: any, transactionID: any, createTransactionDTO: CreateTransactionDTO): Promise<any>;
    deleteTransaction(res: any, transactionID: any): Promise<any>;
    addPredictTransaction(res: any, createTransactionDTO: CreateTransactionDTO[]): Promise<any>;
}
