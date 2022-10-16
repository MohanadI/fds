import { Model } from 'mongoose';
import { Prediction } from './interfaces/prediction.interface';
import { CreatePredictionDTO } from './dto/create-prediction.dto';
export declare class PredictionService {
    private readonly predictionModel;
    constructor(predictionModel: Model<Prediction>);
    addPrediction(createPredictionDTO: CreatePredictionDTO): Promise<Prediction>;
    getPrediction(predictionID: any): Promise<Prediction>;
    getPredictions(): Promise<Prediction[]>;
    editPrediction(predictionID: any, createPredictionDTO: CreatePredictionDTO): Promise<Prediction>;
    deletePrediction(predictionID: any): Promise<any>;
}
