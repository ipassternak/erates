from datetime import datetime
from fastapi import HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.models.wallet import Wallet
from app.schemas.wallet import CreateWalletSchema, GetWalletListSchema, UpdateWalletBalanceSchema, UpdateWalletSchema

def deposit(db: Session, wallet: Wallet, amount: float) -> Wallet:
    wallet.balance += amount
    db.commit()
    db.refresh(wallet)
    return wallet

def withdraw(db: Session, wallet: Wallet, amount: float) -> Wallet:
    if wallet.balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    wallet.balance -= amount
    db.commit()
    db.refresh(wallet)
    return wallet

def get_list(db: Session, params: GetWalletListSchema, decoded_token: dict) -> list[Wallet]:
    user_id = decoded_token["sub"]
    query = db.query(Wallet).filter(Wallet.user_id == user_id)
    if not params.with_archived:
        query = query.filter(Wallet.archived_at == None)
    if params.currency:
        query = query.filter(Wallet.currency == params.currency)
    query = (
        query
        .order_by(Wallet.created_at.desc())
        .offset((params.page - 1) * params.page_size)
        .limit(params.page_size)
    )
    return query.all()

def get_item(db: Session, id: str, decoded_token: dict) -> Wallet:
    user_id = decoded_token["sub"]
    wallet = db.query(Wallet).filter(Wallet.id == id, Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    return wallet

def create_item(db: Session, data: CreateWalletSchema, decoded_token: dict) -> Wallet:
    user_id = decoded_token["sub"]
    new_wallet = Wallet(
        name=data.name,
        user_id=user_id,
        currency=data.currency
    )
    db.add(new_wallet)
    db.commit()
    db.refresh(new_wallet)
    return new_wallet

def update_item(db: Session, id: str, data: UpdateWalletSchema, decoded_token: dict) -> Wallet:
    user_id = decoded_token["sub"]
    wallet = db.query(Wallet).filter(Wallet.id == id, Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    if data.name:
        wallet.name = data.name
    if data.is_archived is not None:
        if data.is_archived:
            wallet.archived_at = datetime.now()
        else:
            wallet.archived_at = None
    db.commit()
    db.refresh(wallet)
    return wallet

def delete_item(db: Session, id: str, decoded_token: dict) -> None:
    user_id = decoded_token["sub"]
    wallet = db.query(Wallet).filter(Wallet.id == id, Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    is_in_use = db.query(Transaction).filter(
        or_(Transaction.to_wallet_id == id, Transaction.from_wallet_id == id)
    ).first()
    if is_in_use:
        raise HTTPException(status_code=400, detail="Wallet is in use")
    db.delete(wallet)
    db.commit()
    return None

def deposit_item(db: Session, id: str, data: UpdateWalletBalanceSchema, decoded_token: dict) -> Wallet:
    user_id = decoded_token["sub"]
    wallet = db.query(Wallet).filter(Wallet.id == id, Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    deposit(db, wallet, data.amount)
    return wallet

def withdraw_item(db: Session, id: str, data: UpdateWalletBalanceSchema, decoded_token: dict) -> Wallet:
    user_id = decoded_token["sub"]
    wallet = db.query(Wallet).filter(Wallet.id == id, Wallet.user_id == user_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    withdraw(db, wallet, data.amount)
    return wallet
