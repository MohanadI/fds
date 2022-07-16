import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
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

  async getTransactionsBySubscriberSeqID(SUBSCRIBER_SEQ_ID): Promise<any[]> {
    const transactions = await this.transactionModel
      .find({ SUBSCRIBER_SEQ_ID: SUBSCRIBER_SEQ_ID })
      .limit(1)
      .exec();
    return transactions;
  }

  async getTransactions(): Promise<Transaction[]> {
    const transactions = await this.transactionModel.find().limit(1000).sort({
      DATE_CREATED: -1
    }).exec();
    return transactions;
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
