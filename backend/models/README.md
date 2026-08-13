# 🧠 Models Directory

This directory stores your trained PyTorch neural network weight checkpoints.

---

## 📥 Where to Get the `.pth` File

From your Kaggle training run / Google Drive internship folder, download either of these files:
- **`dyslexia_efficientnet.pth`** (The final fine-tuned model weights from Cell 8/10 of `snboseFinal1.ipynb`)
- **`best_model.pth`** (The best checkpoint saved during training validation)

Place the downloaded file directly in this folder:
```
backend/models/dyslexia_efficientnet.pth
```

---

## ⚙️ How the Backend Uses This Folder

The backend has a **Dual-Engine Architecture**:

1. **If `.pth` weights are present**:
   - The backend runs `ml/inference.py` using PyTorch to pass the 112x112 character tensor through your exact trained `EfficientNet-B0` neural network and computes GradCAM feature maps.

2. **If `.pth` weights are NOT present**:
   - The backend seamlessly runs its built-in JavaScript/TypeScript stroke engine.
   - **Benefit**: You can deploy, test, and demo the entire full-stack application on any computer or cloud server without needing a GPU, CUDA, or heavy PyTorch libraries installed!
