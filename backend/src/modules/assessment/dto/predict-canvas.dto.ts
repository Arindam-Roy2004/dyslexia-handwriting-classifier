import Joi from "joi";
import { BaseDto } from "../../../common/dto/base.dto.js";

export class PredictCanvasDto extends BaseDto {
  static override schema = Joi.object({
    imageData: Joi.string().required().messages({
      "any.required": "Base64 image data is required.",
      "string.empty": "Image data cannot be empty.",
    }),
    intendedLetter: Joi.string().max(5).optional().default("b"),
    studentAge: Joi.number().min(3).max(18).optional().default(7),
  });
}

export class PredictPresetDto extends BaseDto {
  static override schema = Joi.object({
    sampleId: Joi.string().required().messages({
      "any.required": "Preset sampleId is required.",
    }),
  });
}
