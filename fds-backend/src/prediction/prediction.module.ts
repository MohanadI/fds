import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { MongooseModule } from '@nestjs/mongoose'; // add this
import { PredictionSchema } from './schemas/prediction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Prediction', schema: PredictionSchema },
    ])
  ], // add
  providers: [PredictionService],
  controllers: [PredictionController],
})
export class PredictionModule {}
