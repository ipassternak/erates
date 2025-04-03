from fastapi import APIRouter, Body, Depends, Query, Path
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import auth
from app.schemas.transaction import CreateTransactionSchema, GetTransactionListSchema
import app.services.transaction as transaction_service

transaction_router = APIRouter(
    tags=["Transactions"],
    prefix="/api/transactions",
)

@transaction_router.get("/list")
async def get_list(
    params: GetTransactionListSchema = Query(),
    db: Session = Depends(get_db),
    decoded_token: dict = Depends(auth),
):
    transactions = transaction_service.get_list(db, params, decoded_token)
    transactions = list(map(lambda transaction: {
        "id": transaction.id,
        "from_wallet_id": transaction.from_wallet_id,
        "to_wallet_id": transaction.to_wallet_id,
        "exchange_rate_id": transaction.exchange_rate_id,
        "from_currency": transaction.from_currency.value,
        "to_currency": transaction.to_currency.value,
        "from_amount": transaction.from_amount,
        "to_amount": transaction.to_amount,
        "created_at": transaction.created_at.isoformat(),
        "updated_at": transaction.updated_at.isoformat(),
    }, transactions))
    return JSONResponse(content={"list": transactions})

@transaction_router.post("/item")
async def create_item(
    data: CreateTransactionSchema = Body(),
    db: Session = Depends(get_db),
    decoded_token: dict = Depends(auth),
):
    transaction_service.create_item(db, data, decoded_token)
    return JSONResponse(content={"status": "success"}, status_code=201)
