from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    balance = Column(Float, default=0.0, nullable=False)
    
    # Relación con transacciones
    transactions = relationship("Transaction", back_populates="account")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)
    amount = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.datetime.now)
    type = Column(String, nullable=False)  # "income", "expense", "transfer_in", "transfer_out"
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    to_account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True) # New field for transfers

    # Relación con la cuenta de origen
    account = relationship("Account", foreign_keys=[account_id], back_populates="transactions")
    # Relación con la cuenta de destino (para transferencias)
    to_account = relationship("Account", foreign_keys=[to_account_id])
