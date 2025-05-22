import pandas as pd
import numpy as np
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error
from sklearn.utils import resample
from math import sqrt
import joblib

# 1. Cargar datasets
full_data = pd.read_csv("../../data_def/full_data_features.csv")
test_raw = pd.read_csv("../../data_def/test.csv")  # contiene la columna ID

# 2. Separar training y test
train_data = full_data[full_data['date_block_num'] < 34]
test_data = full_data[full_data['date_block_num'] == 34]

X_train = train_data.drop(columns=['item_cnt_month'])
y_train = train_data['item_cnt_month']
X_test = test_data.drop(columns=['item_cnt_month'])

# 3. Columnas para escalar
features_to_scale = [
    'item_avg_cnt_day', 'shop_avg_cnt_day', 'cat_avg_cnt_day',
    'item_cnt_month_lag1', 'item_total_sales', 'shop_item_freq', 'item_months_sold'
]

# 4. Escalamiento
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train[features_to_scale])
X_test_scaled = scaler.transform(X_test[features_to_scale])

# 5. Muestreo para entrenamiento rápido
X_sampled, y_sampled = resample(X_train_scaled, y_train, n_samples=10000, random_state=42)

# 6. Entrenamiento del modelo
svm = SVR(kernel='rbf', C=1.0, epsilon=0.1)
svm.fit(X_sampled, y_sampled)

# 7. Evaluación en el conjunto de entrenamiento reducido
y_train_pred = svm.predict(X_sampled)
train_mse = mean_squared_error(y_sampled, y_train_pred)
train_rmse = sqrt(train_mse)
print(f"📊 RMSE sobre muestra de entrenamiento: {train_rmse:.4f}")


# 8. Predicciones sobre test completo
svm_preds = np.clip(svm.predict(X_test_scaled), 0, 20)

# 9. Guardado del modelo y scaler
joblib.dump(svm, 'svm_model.pkl')
joblib.dump(scaler, 'scaler.pkl')

# 10. Exportar archivo de submission
submission_svm = pd.DataFrame({
    "ID": test_raw["ID"],
    "item_cnt_month": svm_preds
})
submission_svm.to_csv("submission_svm.csv", index=False)
print("✅ submission_svm.csv generado y guardado correctamente.")

# 11. Mostrar primeras predicciones
print("\n🔍 Primeras predicciones del test:")
print(submission_svm.head(10))

# 12. (Opcional) Ver columnas usadas en test para revisión
print("\n📌 Primeras filas del set de test (features):")
print(X_test[features_to_scale].head(5))
