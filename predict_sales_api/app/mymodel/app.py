from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Cargar modelos y scaler
linear_model = joblib.load('linear_model.pkl')
svm_model = joblib.load('svm_model.pkl')
scaler = joblib.load('scaler.pkl')

# Variables esperadas por el frontend
expected_features = [
    'item_avg_cnt_day', 'shop_avg_cnt_day', 'cat_avg_cnt_day',
    'item_cnt_month_lag1', 'item_total_sales', 'shop_item_freq', 'item_months_sold'
]

@app.route('/forecast_sales/linear', methods=['POST'])
def predict_linear():
    try:
        data = request.get_json()

        missing = [f for f in expected_features if f not in data]
        if missing:
            return jsonify({'error': f'Missing features: {", ".join(missing)}'}), 400

        input_values = [data[f] for f in expected_features]
        input_scaled = scaler.transform([input_values])
        prediction = linear_model.predict(input_scaled)[0]

        return jsonify({'predicted_sales': round(float(prediction), 2)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/forecast_sales/svm', methods=['POST'])
def predict_svm():
    try:
        data = request.get_json()

        missing = [f for f in expected_features if f not in data]
        if missing:
            return jsonify({'error': f'Missing features: {", ".join(missing)}'}), 400

        input_values = [data[f] for f in expected_features]
        input_scaled = scaler.transform([input_values])
        prediction = svm_model.predict(input_scaled)[0]

        return jsonify({'predicted_sales': round(float(prediction), 2)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
