import sys, types
# Safe patch for environments without system lzma
if 'lzma' not in sys.modules:
    class MockLZMA:
        def open(self, *args, **kwargs): pass
    sys.modules['lzma'] = MockLZMA()

import torch
import torch.nn as nn
import torchvision.models.efficientnet as eff

class DyslexiaModel(nn.Module):
    """
    EfficientNet-B0 backbone with customized classification head
    for 3-class dyslexia handwriting analysis:
    0: Normal
    1: Reversal (Dyslexia)
    2: Corrected (Dysgraphia / Motor Hesitation)
    """
    def __init__(self):
        super().__init__()
        backbone = eff.efficientnet_b0(weights=None)
        self.backbone = backbone.features
        self.pool = nn.AdaptiveAvgPool2d((1, 1))
        self.head = nn.Sequential(
            nn.Flatten(),
            nn.Linear(1280, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(64, 3)
        )

    def forward(self, x):
        x = self.backbone(x)
        x = self.pool(x)
        return self.head(x)

    @property
    def gradcam_target_layer(self):
        return self.backbone[-1]
