from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AgriSync ML Mock Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/predict-price")
def predict_price():
    return {
        "forecast": [
            {"day": "D1", "price": 18},
            {"day": "D2", "price": 20},
            {"day": "D3", "price": 23},
            {"day": "D4", "price": 21},
            {"day": "D5", "price": 24},
            {"day": "D6", "price": 26},
            {"day": "D7", "price": 25},
        ]
    }


@app.get("/harvest-recommendation")
def harvest_recommendation():
    return {
        "recommendation": "Harvest Now",
        "risk_score": 31,
        "demand_index": "High",
        "weather": "Light clouds, 27°C",
    }
