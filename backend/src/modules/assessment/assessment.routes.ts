import { Router } from "express";
import assessmentController from "./assessment.controller.js";
import upload from "../../common/middleware/upload.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import { PredictCanvasDto } from "./dto/predict-canvas.dto.js";

const router = Router();

router.post(
  "/canvas",
  validate(PredictCanvasDto),
  assessmentController.predictCanvas,
);

router.post(
  "/upload",
  upload.single("image"),
  assessmentController.predictUpload,
);

router.get("/presets", assessmentController.getPresets);

export default router;
