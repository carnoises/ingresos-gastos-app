from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
import logging

# Importaciones locales
import models
import schemas
import crud
from database import SessionLocal, engine

import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Crea las tablas en la base de datos
try:
    models.Base.metadata.create_all(bind=engine)
    logger.info("Tablas de la base de datos verificadas/creadas exitosamente.")
except Exception as e:
    logger.error(f"No se pudo conectar a la base de datos o crear las tablas: {e}")
    logger.warning("La aplicación continuará ejecutándose, pero las operaciones de base de datos fallarán.")

app = FastAPI(title="API de Ingresos y Gastos", description="API para gestionar finanzas personales", version="0.1.0")

# Configuración de CORS
origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencia para obtener la sesión de la BD
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Endpoints --- 

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Gestión de Ingresos y Gastos"}

# Endpoints para Cuentas
@app.post("/api/accounts/", response_model=schemas.Account, tags=["Accounts"])
def create_account_endpoint(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    db_account = crud.get_account_by_name(db, name=account.name)
    if db_account:
        raise HTTPException(status_code=400, detail="Ya existe una cuenta con este nombre.")
    return crud.create_account(db=db, account=account)

@app.get("/api/accounts/", response_model=List[schemas.Account], tags=["Accounts"])
def read_accounts_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    accounts = crud.get_accounts(db, skip=skip, limit=limit)
    return accounts

@app.put("/api/accounts/{account_id}", response_model=schemas.Account, tags=["Accounts"])
def update_account_endpoint(account_id: int, account: schemas.AccountUpdate, db: Session = Depends(get_db)):
    db_account = crud.update_account(db, account_id=account_id, account_data=account)
    if db_account is None:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada.")
    return db_account

# Endpoints para Transacciones
@app.post("/api/transactions/", response_model=schemas.Transaction, tags=["Transactions"])
def create_transaction_endpoint(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    # La lógica de negocio (actualizar balance) está en la función crud
    db_transaction = crud.create_transaction(db=db, transaction=transaction)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="La cuenta especificada no existe.")
    return db_transaction

# Nuevo Endpoint para Transferencias
@app.post("/api/transfers/", response_model=Dict[str, schemas.Transaction], tags=["Transfers"])
def create_transfer_endpoint(transfer: schemas.TransferCreate, db: Session = Depends(get_db)):
    try:
        result = crud.create_transfer(db=db, transfer=transfer)
        if result is None:
            raise HTTPException(status_code=404, detail="Una o ambas cuentas no fueron encontradas.")
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint para Reportes
import datetime

@app.get("/api/reports/monthly", response_model=schemas.MonthlyReport, tags=["Reports"])
def read_monthly_report_endpoint(year: int = None, month: int = None, db: Session = Depends(get_db)):
    today = datetime.date.today()
    if year is None:
        year = today.year
    if month is None:
        month = today.month
    
    report_data = crud.get_monthly_report(db, year=year, month=month)
    return report_data

@app.get("/api/reports/daily", response_model=schemas.DailyReport, tags=["Reports"])
def read_daily_report_endpoint(year: int, month: int, day: int, db: Session = Depends(get_db)):
    report_data = crud.get_daily_report(db, year=year, month=month, day=day)
    return report_data

@app.delete("/api/transactions/{transaction_id}", response_model=schemas.Transaction, tags=["Transactions"])
def delete_transaction_endpoint(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = crud.delete_transaction(db, transaction_id=transaction_id)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="No se encontró la transacción.")
    return db_transaction

@app.put("/api/transactions/{transaction_id}", response_model=schemas.Transaction, tags=["Transactions"])
def update_transaction_endpoint(transaction_id: int, transaction: schemas.TransactionUpdate, db: Session = Depends(get_db)):
    db_transaction = crud.update_transaction(db, transaction_id=transaction_id, transaction_data=transaction)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="No se encontró la transacción.")
    return db_transaction

