"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionModule = void 0;
const common_1 = require("@nestjs/common");
const prediction_service_1 = require("./prediction.service");
const prediction_controller_1 = require("./prediction.controller");
const mongoose_1 = require("@nestjs/mongoose");
const prediction_schema_1 = require("./schemas/prediction.schema");
let PredictionModule = class PredictionModule {
};
PredictionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Prediction', schema: prediction_schema_1.PredictionSchema },
            ])
        ],
        providers: [prediction_service_1.PredictionService],
        controllers: [prediction_controller_1.PredictionController],
        exports: [prediction_service_1.PredictionService],
    })
], PredictionModule);
exports.PredictionModule = PredictionModule;
//# sourceMappingURL=prediction.module.js.map