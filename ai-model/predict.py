import joblib
import pandas as pd

model = joblib.load("model.pkl")
encoders = joblib.load("encoders.pkl")

komoditas = "Bawang Merah"
provinsi = "Aceh"

tanggal = pd.to_datetime("2025-07-01")

X = [[
    encoders["komoditas"].transform([komoditas])[0],
    encoders["provinsi"].transform([provinsi])[0],
    tanggal.year,
    tanggal.month,
    tanggal.day
]]

prediksi = model.predict(X)

print(f"Prediksi: Rp {prediksi[0]:,.0f}")