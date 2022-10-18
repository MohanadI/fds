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
import { PredictionService } from 'src/prediction/prediction.service';

@Controller('transaction')
export class TransactionController {
  constructor(
    private TransactionService: TransactionService,
    private PredictionService: PredictionService,
  ) {}

  // Submit a transaction
  @Post('/transaction')
  async addTransaction(
    @Res() res,
    @Body() createTransactionDTO: CreateTransactionDTO[],
  ) {
    // for (let i = 0; i < createTransactionDTO.length; i++) {
    //   await this.TransactionService.addTransaction(createTransactionDTO[i]);
    // }
    
    console.log("hello3");
    // await this.TransactionService.replaceDate();

    let transActivities = await this.TransactionService.getTransactions();
    const result = transActivities.reduce(function (r, a) {
      r[a.VISIT_SEQ + '_' + a.SUBSCRIBER_SEQ_ID] = r[a.VISIT_SEQ + '_' + a.SUBSCRIBER_SEQ_ID] || [];
      r[a.VISIT_SEQ + '_' + a.SUBSCRIBER_SEQ_ID].push(a);
      return r;
  }, Object.create(null));

  for(let key in result) {
    let transActivitiesList = result[key];
    const {
      HOF_SEQ_ID,
      SUBSCRIBER_SEQ_ID,
      VISIT_SEQ,
      HOSPITAL_DOCTOR_ID,
      HCP_ID,
      VISIT_DATE,
    } = transActivitiesList[0];

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

    const patientCluster = predictions.patientResult?.data?.cluster;
    const doctorCluster = predictions.doctorResult?.data?.cluster;

    const patientPrediction =
      patientCluster === '1'
        ? 'Fraud'
        : patientCluster === '2'
        ? 'Abuse'
        : patientCluster === '6'
        ? 'Waste'
        : 'Normal';
    const doctorPrediction =
      doctorCluster === '5'
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
    // insert new prediction into database ( predictions )

    await this.PredictionService.addPrediction(predictionToInsert);
  }

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

  @Get('transactionsBySSIAndVI/:SUBSCRIBER_SEQ_ID/:VISIT_SEQ')
  async getTransactionBySubscriberSeqIDAndVisitSeq(
    @Res() res,
    @Param('SUBSCRIBER_SEQ_ID') SUBSCRIBER_SEQ_ID,
    @Param('VISIT_SEQ') VISIT_SEQ,
  ) {
    const transaction = await this.TransactionService.getTransactionBySubscriberSeqIDAndVisitSeq(
      SUBSCRIBER_SEQ_ID,
      VISIT_SEQ,
    );
    if(!transaction) {
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
