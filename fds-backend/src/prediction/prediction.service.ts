import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Prediction } from './interfaces/prediction.interface';
import { CreatePredictionDTO } from './dto/create-prediction.dto';

@Injectable()
export class PredictionService {
  constructor(
    @InjectModel('Prediction')
    private readonly predictionModel: Model<Prediction>,
  ) {}

  async addPrediction(
    createPredictionDTO: CreatePredictionDTO,
  ): Promise<Prediction> {
    const newPrediction = await new this.predictionModel(createPredictionDTO);
    return newPrediction.save();
  }

  async getPrediction(predictionID): Promise<Prediction> {
    const prediction = await this.predictionModel
      .findById(predictionID)
      .exec();
    return prediction;
  }

  async getPredictions(): Promise<Prediction[]> {
    const Predictions = await this.predictionModel.find().limit(10).exec();
    return Predictions;
  }

  async editPrediction(
    predictionID,
    createPredictionDTO: CreatePredictionDTO,
  ): Promise<Prediction> {
    const editedPrediction = await this.predictionModel.findByIdAndUpdate(
      predictionID,
      createPredictionDTO,
      { new: true },
    );
    return editedPrediction;
  }
  async deletePrediction(predictionID): Promise<any> {
    const deletedPrediction = await this.predictionModel.findByIdAndRemove(
      predictionID,
    );
    return deletedPrediction;
  }
}
