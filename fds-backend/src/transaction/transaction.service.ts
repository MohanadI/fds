import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './interfaces/transaction.interface';
import { CreateTransactionDTO } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,
  ) {}

  async addTransaction(
    createTransactionDTO: CreateTransactionDTO,
  ): Promise<Transaction> {
    const newTransaction = await new this.transactionModel(
      createTransactionDTO,
    );
    return newTransaction.save();
  }

  async getTransaction(transactionID): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findById(transactionID)
      .exec();
    return transaction;
  }

  async getTransactionBySubscriberSeqIDAndVisitSeq(
    SUBSCRIBER_SEQ_ID,
    VISIT_SEQ,
  ): Promise<Transaction[]> {
    const transactions = await this.transactionModel
      .find()
      .where({
        SUBSCRIBER_SEQ_ID,
        VISIT_SEQ,
      })
      .exec();
    return transactions;
  }

  async getTransactionsBySubscriberSeqID(SUBSCRIBER_SEQ_ID): Promise<any[]> {
    const transactions = await this.transactionModel
      .find({ SUBSCRIBER_SEQ_ID: SUBSCRIBER_SEQ_ID })
      .limit(1)
      .exec();
    return transactions;
  }

  async getTransactionsByHOFSeqID(HOF_SEQ_ID): Promise<any[]> {
    const oneYearAgo = moment()
      .subtract(1, 'years')
      .format('DD/MM/YY HH:MM');
    const transactions = await this.transactionModel
      .find({
        DATE_CREATED: { $gte: oneYearAgo },
        HOF_SEQ_ID: HOF_SEQ_ID,
      })
      .exec();
    return transactions;
  }

  async getTransactionsByDoctorID(HOSPITAL_DOCTOR_ID, HCP_ID): Promise<any[]> {
    const oneYearAgo = moment()
      .subtract(1, 'years')
      .format('DD/MM/YY HH:MM');
    const transactions = await this.transactionModel
      .find({
        DATE_CREATED: { $gte: oneYearAgo },
        HOSPITAL_DOCTOR_ID: HOSPITAL_DOCTOR_ID,
        HCP_ID: HCP_ID,
      })
      .exec();
    return transactions;
  }

  async getTransactions(): Promise<Transaction[]> {
    const transactions = await this.transactionModel
      .find()
      .sort({
        DATE_CREATED: -1,
      })
      .limit(1000)
      .exec();
    return transactions;
  }

  async replaceDate(): Promise<any> {
    const transactions = await this.transactionModel
      .find()
      .updateMany(
        { },
        [
          {        
            $set: {
              // EFFECTIVE_DATE: { $dateFromString: { dateString: "$EFFECTIVE_DATE" } },
              // DATE_CREATED: { $dateFromString: { dateString: "$DATE_CREATED" } },
              VISIT_DATE: { $dateFromString: { dateString: "$VISIT_DATE", format: "%d/%m/%Y" } },
              // EXPIRATION_DATE: { $dateFromString: { dateString: "$EXPIRATION_DATE" } }
            }
          }
        ]
      )
      .exec();
  }

  async editTransaction(
    transactionID,
    createTransactionDTO: CreateTransactionDTO,
  ): Promise<Transaction> {
    const editedTransaction = await this.transactionModel.findByIdAndUpdate(
      transactionID,
      createTransactionDTO,
      { new: true },
    );
    return editedTransaction;
  }
  async deleteTransaction(transactionID): Promise<any> {
    const deletedTransaction = await this.transactionModel.findByIdAndRemove(
      transactionID,
    );
    return deletedTransaction;
  }
}
