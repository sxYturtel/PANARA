import pandas as pd
import joblib

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

from xgboost import XGBRegressor

# =====================
# LOAD DATA
# =====================

df = pd.read_csv(
    "database_pangan_clean.csv"
)

# =====================
# CONVERT DATE
# =====================

df["Tanggal"] = pd.to_datetime(
    df["Tanggal"]
)

df["tahun"] = df["Tanggal"].dt.year
df["bulan"] = df["Tanggal"].dt.month
df["hari"] = df["Tanggal"].dt.day

# =====================
# ENCODE CATEGORICAL
# =====================

komoditas_encoder = LabelEncoder()
provinsi_encoder = LabelEncoder()

df["komoditas_encoded"] = (
    komoditas_encoder.fit_transform(
        df["Komoditas"]
    )
)

df["provinsi_encoded"] = (
    provinsi_encoder.fit_transform(
        df["Provinsi"]
    )
)

# =====================
# FEATURES
# =====================

X = df[
    [
        "komoditas_encoded",
        "provinsi_encoded",
        "tahun",
        "bulan",
        "hari"
    ]
]

y = df["Harga"]

# =====================
# SPLIT
# =====================

X_train, X_test, y_train, y_test = (
    train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42
    )
)

# =====================
# MODEL
# =====================

model = XGBRegressor(
    n_estimators=300,
    max_depth=8,
    learning_rate=0.05,
    objective="reg:squarederror",
    random_state=42
)

# =====================
# TRAIN
# =====================

model.fit(
    X_train,
    y_train
)

# =====================
# EVALUATE
# =====================

pred = model.predict(X_test)

mae = mean_absolute_error(
    y_test,
    pred
)

print(
    "MAE:",
    round(mae, 2)
)

# =====================
# SAVE
# =====================

joblib.dump(
    model,
    "model.pkl"
)

joblib.dump(
    {
        "komoditas": komoditas_encoder,
        "provinsi": provinsi_encoder
    },
    "encoders.pkl"
)

print("Model berhasil disimpan")