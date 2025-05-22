import { useState } from 'react';

function FormScreen({ onSubmit }) {
  const [features, setFeatures] = useState({
    item_avg_cnt_day: '',
    shop_avg_cnt_day: '',
    cat_avg_cnt_day: '',
    item_cnt_month_lag1: '',
    item_total_sales: '',
    shop_item_freq: '',
    item_months_sold: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFeatures({ ...features, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const hasEmpty = Object.values(features).some(v => v === '');
    if (hasEmpty) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    setError('');
    const parsed = Object.fromEntries(
      Object.entries(features).map(([k, v]) => [k, parseFloat(v)])
    );
    onSubmit(parsed);
  };

  return (
    <div className="App">
      <h1>Predicción de Ventas</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="form-container">
        {Object.keys(features).map((key) => (
          <div className="form-group" key={key}>
            <label>{key.replace(/_/g, ' ')}:</label>
            <input
              type="number"
              name={key}
              value={features[key]}
              onChange={handleChange}
              step="0.01"
            />
          </div>
        ))}
        <button onClick={handleSubmit}>Obtener Predicción</button>
      </div>
    </div>
  );
}

export default FormScreen;
