import torch
import numpy as np

class GradCAM:
    """
    Gradient-weighted Class Activation Mapping (Grad-CAM)
    Computes spatial attention heatmaps across the final convolutional layer.
    """
    def __init__(self, model):
        self.model = model
        self.target_layer = model.gradcam_target_layer
        self.features = None
        self.gradients = None

        self.target_layer.register_forward_hook(self._save_features)
        self.target_layer.register_full_backward_hook(self._save_gradients)

    def _save_features(self, module, inp, out):
        self.features = out.detach()

    def _save_gradients(self, module, gin, gout):
        self.gradients = gout[0].detach()

    def generate(self, tensor: torch.Tensor, class_idx: int) -> np.ndarray:
        self.model.zero_grad()
        logits = self.model(tensor)
        target = logits[0, class_idx]
        target.backward(retain_graph=True)

        weights = self.gradients.mean(dim=(2, 3), keepdim=True)
        cam = torch.relu((weights * self.features).sum(dim=1))
        cam = cam.squeeze().cpu().numpy()

        if cam.max() > 0:
            cam = cam / cam.max()

        return cam
