from fastapi import FastAPI
import joblib
import pandas as pd

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model.pkl")
encoders = joblib.load("encoders.pkl")

@app.get("/")
def home():
    return {"status": "PANARA AI Ready"}

@app.get("/predict")
def predict(
    komoditas: str,
    provinsi: str,
    tanggal: str
):
    dt = pd.to_datetime(tanggal)

    X = [[
        encoders["komoditas"].transform([komoditas])[0],
        encoders["provinsi"].transform([provinsi])[0],
        dt.year,
        dt.month,
        dt.day
    ]]

    prediksi = model.predict(X)

    return {
        "komoditas": komoditas,
        "provinsi": provinsi,
        "tanggal": tanggal,
        "prediksi": round(float(prediksi[0]))
    }