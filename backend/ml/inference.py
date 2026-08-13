import os
import sys
import json
import torch
from PIL import Image
import numpy as np

from model import DyslexiaModel
from preprocessing import get_inference_transforms
from gradcam import GradCAM

def predict_single_letter(
    image_path: str,
    model_path: str = "models/dyslexia_efficientnet.pth",
    reversal_threshold: float = 0.35,
    explain: bool = True
):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = DyslexiaModel().to(device)

    if os.path.exists(model_path):
        state = torch.load(model_path, map_location=device)
        model.load_state_dict(state["model"] if "model" in state else state)
    
    model.eval()

    original_img = Image.open(image_path).convert("RGB")
    tensor = get_inference_transforms()(original_img).unsqueeze(0).to(device)

    if explain:
        gradcam = GradCAM(model)
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1)[0]
    else:
        with torch.no_grad():
            logits = model(tensor)
            probs = torch.softmax(logits, dim=1)[0]

    prob_normal = float(probs[0].item())
    prob_reversal = float(probs[1].item())
    prob_corrected = float(probs[2].item())

    if prob_reversal >= reversal_threshold:
        prediction = "Reversal"
        confidence = prob_reversal
        class_idx = 1
    elif prob_normal > prob_corrected:
        prediction = "Normal"
        confidence = prob_normal
        class_idx = 0
    else:
        prediction = "Corrected"
        confidence = prob_corrected
        class_idx = 2

    heatmap_list = []
    if explain:
        try:
            cam = gradcam.generate(tensor, class_idx)
            cam_resized = Image.fromarray((cam * 255).astype(np.uint8)).resize((28, 28), Image.BILINEAR)
            heatmap_matrix = np.array(cam_resized) / 255.0
            heatmap_list = np.round(heatmap_matrix, 3).tolist()
        except Exception:
            heatmap_list = []

    result = {
        "prediction": prediction,
        "confidence": round(confidence, 4),
        "probabilities": {
            "Normal": round(prob_normal, 4),
            "Reversal": round(prob_reversal, 4),
            "Corrected": round(prob_corrected, 4)
        },
        "heatmapMatrix": heatmap_list
    }

    return result

if __name__ == "__main__":
    if len(sys.argv) > 1:
        img_path = sys.argv[1]
        mod_path = sys.argv[2] if len(sys.argv) > 2 else "models/dyslexia_efficientnet.pth"
        res = predict_single_letter(img_path, mod_path)
        print(json.dumps(res))
    else:
        print(json.dumps({"error": "Missing image_path argument"}))
