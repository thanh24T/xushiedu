import numpy as np
import joblib
import io
import base64
from PIL import Image

# Load model khi khởi động
mlp_weights = joblib.load("ml_models/mlp_model_v5.pkl")
CLASS_NAMES  = mlp_weights['LABELS']

def relu(x):
    return np.maximum(0, x)

def softmax(x):
    e = np.exp(x - np.max(x))
    return e / e.sum()

def mlp_predict(x):
    params   = mlp_weights['params']
    layers   = mlp_weights['layers']
    a        = x
    n_layers = len(layers) - 1
    for i in range(1, n_layers + 1):
        W = params[f'W{i}'].flatten().reshape(params[f'W{i}'].shape)
        b = params[f'b{i}'].flatten()
        a = W @ a + b
        if i < n_layers:
            a = relu(a)
    return softmax(a)

def preprocess(file):
    img = Image.open(file).convert('L')

    # Invert để nét vẽ thành trắng, nền thành đen
    arr = np.array(img)
    arr_inv = 255 - arr

    # Tìm bounding box của nét vẽ
    threshold = 20
    rows = np.any(arr_inv > threshold, axis=1)
    cols = np.any(arr_inv > threshold, axis=0)

    if rows.any() and cols.any():
        rmin, rmax = np.where(rows)[0][[0, -1]]
        cmin, cmax = np.where(cols)[0][[0, -1]]

        # Thêm padding 10% quanh bounding box
        h, w = arr_inv.shape
        pad_r = max(int((rmax - rmin) * 0.1), 4)
        pad_c = max(int((cmax - cmin) * 0.1), 4)
        rmin = max(0, rmin - pad_r)
        rmax = min(h, rmax + pad_r)
        cmin = max(0, cmin - pad_c)
        cmax = min(w, cmax + pad_c)

        cropped = arr_inv[rmin:rmax, cmin:cmax]
    else:
        cropped = arr_inv

    # Resize về 28x28
    cropped_img = Image.fromarray(cropped.astype(np.uint8), mode='L')
    cropped_img = cropped_img.resize((28, 28), Image.LANCZOS)
    result = np.array(cropped_img) / 255.0

    # Tạo preview
    preview_img = Image.fromarray((result * 255).astype(np.uint8), mode='L')
    buf = io.BytesIO()
    preview_img.save(buf, format='PNG')
    preview_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')

    return result.flatten(), preview_b64
