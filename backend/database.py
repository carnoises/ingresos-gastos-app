from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os

# Obtener la URL de la base de datos de las variables de entorno
# Para desarrollo local, puedes mantener SQLite o configurar una variable de entorno local
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ingresos_gastos.db")

# Si es SQLite, añadir connect_args
connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)

# Creación de la sesión de la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos ORM de SQLAlchemy
Base = declarative_base()
