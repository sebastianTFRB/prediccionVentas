import { useState } from 'react'
import './App.css'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [productId, setProductId] = useState('');
  const [shopId, setShopId] = useState('');
  const [date, setDate] = useState(''); // Changed default to empty string for better validation
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);

  const handlePredict = async () => {
    // Basic validation
    if (!productId || !shopId || !date) {
      setError('Please fill in all fields.');
      setPrediction(null); // Clear previous prediction
      return;
    } else {
 setError(''); // Clear previous errors if validation passes
    }

    setChartData(null); // Clear previous chart data
    try {
      const response = await fetch('/forecast_sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, shop_id: shopId, date: date }),
      });

      const data = await response.json();
      setPrediction(data.prediction); // Assuming your Flask API returns a JSON object with a 'prediction' key

      // Prepare data for the chart
      setChartData({
        labels: [date], // Use the prediction date as the label
        datasets: [
          {
            label: 'Predicted Sales',
            data: [data.prediction], // The predicted sales value
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction("Error fetching prediction"); // Display an error message in the UI
      setChartData(null); // Clear chart data on error
    }
  };

  return (
    <div className="App">
      <h1>Predicción de Ventas de Productos Electrónicos</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="form-container">
        <div className="input-fields-container">
          <div className="form-group">
            <label htmlFor="productId">ID del Producto:</label>
            <input type="text" id="productId" value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="Ingresa ID del Producto" />
          </div>
          <div className="form-group">
            <label htmlFor="shopId">ID de la Tienda:</label>
            <input type="text" id="shopId" value={shopId} onChange={(e) => setShopId(e.target.value)} placeholder="Ingresa ID de la Tienda" />
          </div>
          <div className="form-group">
            <label htmlFor="date">Fecha:</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          {/* Move the button inside the input-fields-container */}
          <button type="button" onClick={handlePredict}>
            Obtener Predicción
          </button>
        </div>
      </div>
      {prediction !== null && <h2>Predicted Sales: {prediction}</h2>}

      {/* Render chart if chartData is available */}
      {chartData && <div className="chart-container"><Line data={chartData} /></div>}
    </div>
  )
}

export default App
