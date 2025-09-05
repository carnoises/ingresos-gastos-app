from sqlalchemy.orm import Session
import models
import schemas

# --- Funciones CRUD para Cuentas (Accounts) ---

def get_account(db: Session, account_id: int):
    """Obtiene una cuenta por su ID."""
    return db.query(models.Account).filter(models.Account.id == account_id).first()

def get_account_by_name(db: Session, name: str):
    """Obtiene una cuenta por su nombre."""
    return db.query(models.Account).filter(models.Account.name == name).first()

def get_accounts(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todas las cuentas."""
    return db.query(models.Account).offset(skip).limit(limit).all()

def create_account(db: Session, account: schemas.AccountCreate):
    """Crea una nueva cuenta."""
    db_account = models.Account(name=account.name, balance=account.balance)
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def update_account(db: Session, account_id: int, account_data: schemas.AccountUpdate):
    """Actualiza una cuenta existente."""
    db_account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not db_account:
        return None

    if account_data.name is not None:
        db_account.name = account_data.name
    if account_data.balance is not None:
        db_account.balance = account_data.balance

    db.commit()
    db.refresh(db_account)
    return db_account

def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    """
    Crea una nueva transacción y actualiza el balance de la cuenta correspondiente.
    """
    # 1. Obtener la cuenta de la base de datos
    db_account = get_account(db, account_id=transaction.account_id)
    if not db_account:
        return None # La cuenta no fue encontrada

    # 2. Crear el objeto de la transacción
    db_transaction = models.Transaction(
        description=transaction.description,
        amount=abs(transaction.amount), # Guardar siempre el monto en positivo
        type=transaction.type,
        account_id=transaction.account_id,
        date=transaction.date or datetime.datetime.now() # Usar fecha proporcionada o la actual
    )

    # 3. Actualizar el balance de la cuenta
    if transaction.type == 'income':
        db_account.balance += abs(transaction.amount)
    elif transaction.type == 'expense':
        db_account.balance -= abs(transaction.amount)

    # 4. Añadir los cambios a la sesión y confirmar
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    return db_transaction

# --- Funciones para Reportes ---
from sqlalchemy import func, extract

def get_monthly_report(db: Session, year: int, month: int):
    """
    Calcula el total de ingresos y gastos para un mes y año específicos.
    """
    total_income = db.query(func.sum(models.Transaction.amount)).filter(
        extract('year', models.Transaction.date) == year,
        extract('month', models.Transaction.date) == month,
        models.Transaction.type == 'income'
    ).scalar() or 0.0

    total_expense = db.query(func.sum(models.Transaction.amount)).filter(
        extract('year', models.Transaction.date) == year,
        extract('month', models.Transaction.date) == month,
        models.Transaction.type == 'expense'
    ).scalar() or 0.0

    return {
        "year": year,
        "month": month,
        "total_income": total_income,
        "total_expense": total_expense,
        "net_balance": total_income - total_expense
    }

def get_daily_report(db: Session, year: int, month: int, day: int):
    """
    Calcula el total de ingresos y gastos para un día específico.
    """
    total_income = db.query(func.sum(models.Transaction.amount)).filter(
        extract('year', models.Transaction.date) == year,
        extract('month', models.Transaction.date) == month,
        extract('day', models.Transaction.date) == day,
        models.Transaction.type == 'income'
    ).scalar() or 0.0

    total_expense = db.query(func.sum(models.Transaction.amount)).filter(
        extract('year', models.Transaction.date) == year,
        extract('month', models.Transaction.date) == month,
        extract('day', models.Transaction.date) == day,
        models.Transaction.type == 'expense'
    ).scalar() or 0.0

    return {
        "year": year,
        "month": month,
        "day": day,
        "total_income": total_income,
        "total_expense": total_expense,
        "net_balance": total_income - total_expense
    }

def delete_transaction(db: Session, transaction_id: int):
    """
    Elimina una transacción y revierte su efecto en el balance de la cuenta.
    """
    # 1. Encontrar la transacción
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_transaction:
        return None # No se encontró la transacción

    # 2. Encontrar la cuenta asociada
    db_account = db_transaction.account

    # 3. Revertir el balance
    if db_transaction.type == 'income':
        db_account.balance -= db_transaction.amount
    elif db_transaction.type == 'expense':
        db_account.balance += db_transaction.amount
    elif db_transaction.type == 'transfer_out':
        db_account.balance += db_transaction.amount # Add back to source account
    elif db_transaction.type == 'transfer_in':
        db_account.balance -= db_transaction.amount # Subtract from destination account

    # 4. Eliminar la transacción y confirmar los cambios
    db.delete(db_transaction)
    db.commit()

    return db_transaction

def update_transaction(db: Session, transaction_id: int, transaction_data: schemas.TransactionUpdate):
    """
    Actualiza una transacción y ajusta el balance de la cuenta.
    """
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_transaction:
        return None

    db_account = db_transaction.account

    # Revertir el monto original de la cuenta
    if db_transaction.type == 'income':
        db_account.balance -= db_transaction.amount
    else:  # expense
        db_account.balance += db_transaction.amount

    # Actualizar los campos de la transacción con los nuevos datos
    if transaction_data.description is not None:
        db_transaction.description = transaction_data.description
    if transaction_data.amount is not None:
        db_transaction.amount = abs(transaction_data.amount)
    if transaction_data.date is not None:
        db_transaction.date = transaction_data.date

    # Aplicar el nuevo monto a la cuenta
    if db_transaction.type == 'income':
        db_account.balance += db_transaction.amount
    else:  # expense
        db_account.balance -= db_transaction.amount

    db.commit()
    db.refresh(db_transaction)
    return db_transactionon_data: schemas.TransactionUpdate):
    """
    Actualiza una transacción y ajusta el balance de la cuenta.
    """
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_transaction:
        return None

    db_account = db_transaction.account

    # Revertir el monto original de la cuenta
    if db_transaction.type == 'income':
        db_account.balance -= db_transaction.amount
    else:  # expense
        db_account.balance += db_transaction.amount

    # Actualizar los campos de la transacción con los nuevos datos
    if transaction_data.description is not None:
        db_transaction.description = transaction_data.description
    if transaction_data.amount is not None:
        db_transaction.amount = abs(transaction_data.amount)
    if transaction_data.date is not None:
        db_transaction.date = transaction_data.date

    # Aplicar el nuevo monto a la cuenta
    if db_transaction.type == 'income':
        db_account.balance += db_transaction.amount
    else:  # expense
        db_account.balance -= db_transaction.amount

    db.commit()
    db.refresh(db_transaction)
    return db_transaction