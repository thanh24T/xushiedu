from flask import Blueprint, request, jsonify
import numpy as np
import io
from ml.predictor import preprocess, mlp_predict, CLASS_NAMES

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'Không có ảnh'}), 400

    file = request.files['image']
    x, preview_b64 = preprocess(io.BytesIO(file.read()))
    proba = mlp_predict(x)

    idx        = int(np.argmax(proba))
    label      = CLASS_NAMES[idx]
    confidence = round(float(proba[idx]) * 100, 2)

    top5_idx = np.argsort(proba)[::-1][:5]
    top5 = [
        {'label': CLASS_NAMES[i], 'confidence': round(float(proba[i]) * 100, 2)}
        for i in top5_idx
    ]

    return jsonify({
        'label': label,
        'confidence': confidence,
        'top5': top5,
        'preview': preview_b64,
        'model_used': 'mlp'
    })

@predict_bp.route('/models', methods=['GET'])
def get_models():
    return jsonify({'models': ['mlp'], 'labels': CLASS_NAMES})
