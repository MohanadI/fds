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
import { PredictionService } from './prediction.service';
import { TransactionService } from '../transaction/transaction.service';
import { CreatePredictionDTO } from './dto/create-prediction.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';

@Controller('prediction')
export class PredictionController {
  constructor(
    private PredictionService: PredictionService,
    private TransactionService: TransactionService,
  ) {}

  // Submit a prediction
  @Post('/prediction')
  async addPrediction(
    @Res() res,
    @Body() createPredictionDTO: CreatePredictionDTO,
  ) {
    const newPrediction = await this.PredictionService.addPrediction(
      createPredictionDTO,
    );
    return res.status(HttpStatus.OK).json({
      message: 'Prediction has been submitted successfully!',
      prediction: newPrediction,
    });
  }

  // Fetch a particular prediction using ID
  @Get('prediction/:predictionID')
  async getPrediction(
    @Res() res,
    @Param('predictionID', new ValidateObjectId()) predictionID,
  ) {
    const prediction = await this.PredictionService.getPrediction(predictionID);
    if (!prediction) {
      throw new NotFoundException('Prediction does not exist!');
    }
    return res.status(HttpStatus.OK).json(prediction);
  }

  // Fetch all predictions
  @Get('predictions')
  async getPredictions(@Res() res) {
    const predictions = await this.PredictionService.getPredictions();
    for(let i = 0; i < predictions.length; i++) {
      const transaction =
      await this.TransactionService.getTransactionsBySubscriberSeqID(
        predictions[i].SUBSCRIBER_SEQ_ID,
      );
      predictions[i].transactions = transaction;
    }

    return res.status(HttpStatus.OK).json(predictions);
  }
  @Put('/edit')
  async editPrediction(
    @Res() res,
    @Query('predictionID', new ValidateObjectId()) predictionID,
    @Body() createPredictionDTO: CreatePredictionDTO,
  ) {
    const editedPrediction = await this.PredictionService.editPrediction(
      predictionID,
      createPredictionDTO,
    );
    if (!editedPrediction) {
      throw new NotFoundException('Prediction does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Prediction has been successfully updated',
      prediction: editedPrediction,
    });
  }
  // Delete a prediction using ID
  @Delete('/delete')
  async deletePrediction(
    @Res() res,
    @Query('predictionID', new ValidateObjectId()) predictionID,
  ) {
    const deletedPrediction = await this.PredictionService.deletePrediction(
      predictionID,
    );
    if (!deletedPrediction) {
      throw new NotFoundException('Prediction does not exist!');
    }
    return res.status(HttpStatus.OK).json({
      message: 'Prediction has been deleted!',
      prediction: deletedPrediction,
    });
  }
}
