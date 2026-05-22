from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from db.models import db
from routes.auth import auth_bp
from routes.predict import predict_bp
from routes.progress import progress_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)

app.register_blueprint(auth_bp)
app.register_blueprint(predict_bp)
app.register_blueprint(progress_bp)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return jsonify({'status': 'running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
