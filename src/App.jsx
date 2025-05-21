import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [productId, setProductId] = useState('');
  const [shopId, setShopId] = useState('');
  const [date, setDate] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);

  const handlePredict = async () => {
    if (!productId || !shopId || !date) {
      setError('Por favor, complete todos los campos.');
      setPrediction(null);
      setChartData(null);
      return;
    }

    setError('');
    setChartData(null);

    try {
      const response = await fetch('/forecast_sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, shop_id: shopId, date }),
      });

      const data = await response.json();
      setPrediction(data.prediction);

      setChartData({
        labels: [date],
        datasets: [
          {
            label: 'Predicted Sales',
            data: [data.prediction],
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction("Error fetching prediction");
      setChartData(null);
    }
  };

  const handleShowForm = () => {
    setPrediction(null);
    setChartData(null);
    setError('');
  };

  return (
    <div className="App">
      <h1>Predicción de Ventas de Productos Electrónicos</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="form-container">
        <div className="input-fields-container">
          <div className="form-group">
            <label htmlFor="productId">ID del Producto:</label>
            <input
              type="text"
              id="productId"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Ingresa ID del Producto"
            />
          </div>
          <div className="form-group">
            <label htmlFor="shopId">ID de la Tienda:</label>
            <input
              type="text"
              id="shopId"
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              placeholder="Ingresa ID de la Tienda"
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Fecha:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button type="button" onClick={handlePredict}>
            Obtener Predicción
          </button>
        </div>
      </div>

      {prediction !== null && <h2>Predicted Sales: {prediction}</h2>}
      {chartData && (
        <div className="chart-container">
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}

export default App;
