import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'xushi_secret')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    _server   = os.getenv('DB_SERVER', r'TOILAHUUNHAN\SQLEXPRESS')
    _database = os.getenv('DB_NAME', 'xushi_dacn1')

    SQLALCHEMY_DATABASE_URI = (
        f"mssql+pyodbc://@{_server}/{_database}"
        f"?driver=ODBC+Driver+17+for+SQL+Server"
        f"&Trusted_Connection=yes"
        f"&TrustServerCertificate=yes"
    )
