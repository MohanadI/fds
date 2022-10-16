"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionController = void 0;
const common_1 = require("@nestjs/common");
const prediction_service_1 = require("./prediction.service");
const create_prediction_dto_1 = require("./dto/create-prediction.dto");
const validate_object_id_pipes_1 = require("../shared/pipes/validate-object-id.pipes");
let PredictionController = class PredictionController {
    constructor(PredictionService) {
        this.PredictionService = PredictionService;
    }
    async addPrediction(res, createPredictionDTO) {
        const newPrediction = await this.PredictionService.addPrediction(createPredictionDTO);
        return res.status(common_1.HttpStatus.OK).json({
            message: 'Prediction has been submitted successfully!',
            prediction: newPrediction,
        });
    }
    async getPrediction(res, predictionID) {
        const prediction = await this.PredictionService.getPrediction(predictionID);
        if (!prediction) {
            throw new common_1.NotFoundException('Prediction does not exist!');
        }
        return res.status(common_1.HttpStatus.OK).json(prediction);
    }
    async getPredictions(res) {
        const predictions = await this.PredictionService.getPredictions();
        return res.status(common_1.HttpStatus.OK).json(predictions);
    }
    async editPrediction(res, predictionID, createPredictionDTO) {
        const editedPrediction = await this.PredictionService.editPrediction(predictionID, createPredictionDTO);
        if (!editedPrediction) {
            throw new common_1.NotFoundException('Prediction does not exist!');
        }
        return res.status(common_1.HttpStatus.OK).json({
            message: 'Prediction has been successfully updated',
            prediction: editedPrediction,
        });
    }
    async deletePrediction(res, predictionID) {
        const deletedPrediction = await this.PredictionService.deletePrediction(predictionID);
        if (!deletedPrediction) {
            throw new common_1.NotFoundException('Prediction does not exist!');
        }
        return res.status(common_1.HttpStatus.OK).json({
            message: 'Prediction has been deleted!',
            prediction: deletedPrediction,
        });
    }
};
__decorate([
    (0, common_1.Post)('/prediction'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_prediction_dto_1.CreatePredictionDTO]),
    __metadata("design:returntype", Promise)
], PredictionController.prototype, "addPrediction", null);
__decorate([
    (0, common_1.Get)('prediction/:predictionID'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('predictionID', new validate_object_id_pipes_1.ValidateObjectId())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PredictionController.prototype, "getPrediction", null);
__decorate([
    (0, common_1.Get)('predictions'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PredictionController.prototype, "getPredictions", null);
__decorate([
    (0, common_1.Put)('/edit'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('predictionID', new validate_object_id_pipes_1.ValidateObjectId())),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_prediction_dto_1.CreatePredictionDTO]),
    __metadata("design:returntype", Promise)
], PredictionController.prototype, "editPrediction", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('predictionID', new validate_object_id_pipes_1.ValidateObjectId())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PredictionController.prototype, "deletePrediction", null);
PredictionController = __decorate([
    (0, common_1.Controller)('prediction'),
    __metadata("design:paramtypes", [prediction_service_1.PredictionService])
], PredictionController);
exports.PredictionController = PredictionController;
//# sourceMappingURL=prediction.controller.js.map