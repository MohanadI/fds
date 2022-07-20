import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose'; // add this
import { TransactionSchema } from './schemas/transaction.schema'; // and this
import { PredictionModule } from 'src/prediction/prediction.module';

@Module({
  imports: [
    PredictionModule,
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
    ]),
  ], // add
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
