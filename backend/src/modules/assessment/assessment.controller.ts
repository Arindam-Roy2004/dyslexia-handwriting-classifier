import { Request, Response } from "express";
import asyncHandler from "../../common/middleware/async-handler.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";
import assessmentService, { AssessmentService } from "./assessment.service.js";

export class AssessmentController {
  constructor(private readonly service: AssessmentService = assessmentService) {}

  /**
   * POST /api/assessment/canvas
   * Analyzes raw base64 image data drawn on the frontend canvas
   */
  predictCanvas = asyncHandler(async (req: Request, res: Response) => {
    const { imageData, intendedLetter } = req.body;
    if (!imageData) {
      throw ApiError.badRequest("imageData is required");
    }

    const result = await this.service.predictFromBase64(imageData, intendedLetter);
    return ApiResponse.ok(res, "Handwriting canvas analyzed successfully", result);
  });

  /**
   * POST /api/assessment/upload
   * Analyzes an uploaded image file (JPEG, PNG, etc.)
   */
  predictUpload = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw ApiError.badRequest("No image file provided in upload");
    }

    const intendedLetter = (req.body.intendedLetter as string) || "b";
    const result = await this.service.predictFromBuffer(
      req.file.buffer,
      req.file.mimetype,
      intendedLetter,
    );
    return ApiResponse.ok(res, "Uploaded image evaluated successfully", result);
  });

  /**
   * GET /api/assessment/presets
   * Returns pre-configured demo cases for instant evaluation
   */
  getPresets = asyncHandler(async (_req: Request, res: Response) => {
    const presets = this.service.getPresetSamples();
    return ApiResponse.ok(res, "Preset samples fetched successfully", presets);
  });
}

export const assessmentController = new AssessmentController();
export default assessmentController;
