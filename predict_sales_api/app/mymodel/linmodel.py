import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error
import joblib

# 1. Cargar datasets locales
full_data = pd.read_csv("../../data_def/full_data_features.csv")
test_raw = pd.read_csv("../../data_def/test.csv")  # contiene la columna ID

# 2. Separar training y test con base en date_block_num
train_data = full_data[full_data['date_block_num'] < 34]
test_data = full_data[full_data['date_block_num'] == 34]

X_train = train_data.drop(columns=['item_cnt_month'])
y_train = train_data['item_cnt_month']
X_test = test_data.drop(columns=['item_cnt_month'])

# 3. Seleccionar columnas a escalar (excluimos IDs)
features_to_scale = [
    'item_avg_cnt_day', 'shop_avg_cnt_day', 'cat_avg_cnt_day',
    'item_cnt_month_lag1', 'item_total_sales', 'shop_item_freq', 'item_months_sold'
]

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train[features_to_scale])
X_test_scaled = scaler.transform(X_test[features_to_scale])

# 4. Entrenar modelos

## Regresión Lineal
lr = LinearRegression()
lr.fit(X_train_scaled, y_train)
lr_preds = np.clip(lr.predict(X_test_scaled), 0, 20)

joblib.dump(lr, 'linear_model.pkl')

joblib.dump(scaler, 'scaler.pkl')  

# 5. Exportar predicciones (elige uno)

## Submission con Regresión Lineal
submission_lr = pd.DataFrame({
    "ID": test_raw["ID"],
    "item_cnt_month": lr_preds
})
submission_lr.to_csv("submission_lr.csv", index=False)



print("✅ Archivos submission_lr.csv y submission_svm.csv generados con éxito.")
