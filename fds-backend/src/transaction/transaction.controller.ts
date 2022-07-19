import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Param,
  NotFoundException,
  Post,
  Body,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { Aggregator } from 'src/ml-model/aggregator';

@Controller('transaction')
export class TransactionController {
  constructor(private TransactionService: TransactionService) {}

  // Submit a transaction
  @Post('/transaction')
  async addTransaction(
    @Res() res,
    @Body() createTransactionDTO: CreateTransactionDTO[],
  ) {
    for (let i = 0; i < createTransactionDTO.length; i++) {
      await this.TransactionService.addTransaction(createTransactionDTO[i]);
    }

    const {
      HOF_SEQ_ID,
      SUBSCRIBER_SEQ_ID,
      VISIT_SEQ,
      HOSPITAL_DOCTOR_ID,
      HCP_ID,
    } = createTransactionDTO[0];

    const transactionsForPatientML =
      await this.TransactionService.getTransactionsByHOFSeqID(HOF_SEQ_ID);
    const transactionsForDoctorML =
      await this.TransactionService.getTransactionsByDoctorID(
        HOSPITAL_DOCTOR_ID,
        HCP_ID,
      );

    const newAggregator = new Aggregator();
    const predictions = await newAggregator.getMLPrediction(
      HOF_SEQ_ID,
      SUBSCRIBER_SEQ_ID,
      VISIT_SEQ,
      HOSPITAL_DOCTOR_ID,
      HCP_ID,
      transactionsForPatientML,
      transactionsForDoctorML,
    );

    // console.log(" --------------------- ")
    // console.log("predictions");
    // console.log(predictions);
    // insert new prediction into database ( predictions )

    return res.status(HttpStatus.OK).json({
      message: 'Transaction has been submitted successfully!',
      transaction: {},
    });
  }

  // Fetch a particular transaction using ID
  @Get('transaction/:transactionID')
  async getTransaction(
    @Res() res,
    @Param('transactionID', new ValidateObjectId()) transactionID,
  ) {
    const transaction = await this.TransactionService.getTransaction(
      transactionID,
    );
    if (!transaction) {
      throw new NotFoundException('Transaction does not exist!');
    }
    return res.status(HttpStatus.OK).json(transaction);
  }

  // Fetch all transactions
  @Get('transactions')
  async getTransactions(@Res() res) {
    const transactions = await this.TransactionService.getTransactions();
    return res.status(HttpStatus.OK).json(transactions);
  }

  @Get('transactionsBySSI/:subscriberSeqID')
  async getTransactionsBySubscriberSeqID(
    @Res() res,
    @Param('subscriberSeqID') SUBSCRIBER_SEQ_ID,
  ) {
    const transactions =
      await this.TransactionService.getTransactionsBySubscriberSeqID(
        SUBSCRIBER_SEQ_ID,
      );
    return res.status(HttpStatus.OK).json(transactions);
  }

  @Put('/edit')
  async editTransaction(
    @Res() res,
    @Query('transactionID', new ValidateObjectId()) transactionID,
    @Body() createTransactionDTO: CreateTransactionDTO,
  ) {
    const editedTransaction = await this.TransactionService.editTransaction(
      transactionID,
      createTransactionDTO,
    );
    if (!editedTransaction) {
      throw new NotFoundException('Transaction does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Transaction has been successfully updated',
      transaction: editedTransaction,
    });
  }
  // Delete a transaction using ID
  @Delete('/delete')
  async deleteTransaction(
    @Res() res,
    @Query('transactionID', new ValidateObjectId()) transactionID,
  ) {
    const deletedTransaction = await this.TransactionService.deleteTransaction(
      transactionID,
    );
    if (!deletedTransaction) {
      throw new NotFoundException('Transaction does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Transaction has been deleted!',
      transaction: deletedTransaction,
    });
  }
}
