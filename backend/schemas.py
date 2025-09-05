from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# --- Esquemas para Transacciones ---

class TransactionBase(BaseModel):
    description: str | None = None
    amount: float
    type: str # "income", "expense", "transfer_in", "transfer_out"
    to_account_id: Optional[int] = None # New field
    category_id: Optional[int] = None # New field for categories

class TransactionCreate(TransactionBase):
    account_id: int
    date: Optional[datetime] = None # Campo de fecha opcional

class Transaction(TransactionBase):
    id: int
    date: datetime
    account_id: int
    to_account_id: Optional[int] = None # New field
    category_id: Optional[int] = None # New field

    class Config:
        from_attributes = True

# --- Esquemas para Categorías ---

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True

# New TransferCreate schema
class TransferCreate(BaseModel):
    from_account_id: int
    to_account_id: int
    amount: float
    description: str | None = None

# --- Esquemas para Cuentas ---

class AccountBase(BaseModel):
    name: str
    type: str = "Banco" # New field

class AccountCreate(AccountBase):
    balance: float = 0.0

class Account(AccountBase):
    id: int
    balance: float
    transactions: List[Transaction] = []

    class Config:
        from_attributes = True

class AccountUpdate(BaseModel):
    name: Optional[str] = None
    balance: Optional[float] = None

# --- Esquemas para Reportes ---

class MonthlyReport(BaseModel):
    year: int
    month: int
    total_income: float
    total_expense: float
    net_balance: float

class TransactionUpdate(BaseModel):
    description: str | None = None
    amount: float | None = None
    date: Optional[datetime] = None

class DailyReport(BaseModel):
    year: int
    month: int
    day: int
    total_income: float
    total_expense: float
    net_balance: float
