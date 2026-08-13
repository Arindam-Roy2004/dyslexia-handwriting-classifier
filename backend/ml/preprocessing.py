import cv2
import numpy as np
from PIL import Image
import torch

class ExtractCharacter:
    """Detect handwritten character bounding box and crop tightly."""
    def __call__(self, image: Image.Image) -> Image.Image:
        img = np.array(image)
        if len(img.shape) == 2:
            gray = img
        else:
            gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
            
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        coords = cv2.findNonZero(thresh)

        if coords is None:
            return image

        x, y, w, h = cv2.boundingRect(coords)
        pad = int(max(w, h) * 0.25)
        x = max(0, x - pad)
        y = max(0, y - pad)
        w = min(img.shape[1] - x, w + 2 * pad)
        h = min(img.shape[0] - y, h + 2 * pad)

        cropped = img[y:y+h, x:x+w]
        return Image.fromarray(cropped)


class NormalizeInk:
    """Otsu thresholding to remove color variance and isolate black strokes."""
    def __call__(self, image: Image.Image) -> Image.Image:
        img = np.array(image)
        if len(img.shape) == 2:
            gray = img
        else:
            gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
            
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        rgb = cv2.cvtColor(binary, cv2.COLOR_GRAY2RGB)
        return Image.fromarray(rgb)


class SquarePad:
    """Aspect-ratio preserving square padding with white background."""
    def __call__(self, image: Image.Image) -> Image.Image:
        w, h = image.size
        max_wh = max(w, h)
        if max_wh <= 0:
            return image
        padded = Image.new("RGB", (max_wh, max_wh), (255, 255, 255))
        hp = (max_wh - w) // 2
        vp = (max_wh - h) // 2
        padded.paste(image, (hp, vp))
        return padded


def preprocess_image_to_tensor(image: Image.Image) -> torch.Tensor:
    """
    Standardized pure PyTorch + PIL transform pipeline for 112x112 character inference.
    Exact match for torchvision: Resize((112, 112)) -> ToTensor() -> Normalize()
    """
    img = ExtractCharacter()(image)
    img = NormalizeInk()(img)
    img = SquarePad()(img)
    img = img.resize((112, 112), Image.BILINEAR)

    # Convert to FloatTensor (3, 112, 112) normalized [0, 1]
    arr = np.array(img, dtype=np.float32) / 255.0
    if len(arr.shape) == 2:
        arr = np.stack([arr] * 3, axis=-1)
    tensor = torch.from_numpy(arr.transpose((2, 0, 1))).float()

    # Normalize with ImageNet stats
    mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
    std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
    return (tensor - mean) / std
