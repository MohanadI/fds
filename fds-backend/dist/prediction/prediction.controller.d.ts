import { PredictionService } from './prediction.service';
import { CreatePredictionDTO } from './dto/create-prediction.dto';
export declare class PredictionController {
    private PredictionService;
    constructor(PredictionService: PredictionService);
    addPrediction(res: any, createPredictionDTO: CreatePredictionDTO): Promise<any>;
    getPrediction(res: any, predictionID: any): Promise<any>;
    getPredictions(res: any): Promise<any>;
    editPrediction(res: any, predictionID: any, createPredictionDTO: CreatePredictionDTO): Promise<any>;
    deletePrediction(res: any, predictionID: any): Promise<any>;
}
