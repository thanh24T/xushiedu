from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id         = db.Column(db.Integer, primary_key=True)
    email      = db.Column(db.String(255), unique=True, nullable=False)
    password   = db.Column(db.String(255), nullable=False)
    name       = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, raw):
        self.password = generate_password_hash(raw)

    def check_password(self, raw):
        return check_password_hash(self.password, raw)

    def to_dict(self):
        return {'id': self.id, 'email': self.email, 'name': self.name}


class DrawingSession(db.Model):
    __tablename__ = 'drawing_sessions'

    id           = db.Column(db.Integer, primary_key=True)
    user_id      = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    label        = db.Column(db.String(100), nullable=False)
    lesson_id    = db.Column(db.String(50), nullable=True)
    is_correct   = db.Column(db.Boolean, default=True)
    tries        = db.Column(db.Integer, default=1)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'label': self.label,
            'lesson_id': self.lesson_id,
            'is_correct': self.is_correct,
            'tries': self.tries,
            'completed_at': self.completed_at.isoformat()
        }
