import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function ResultScreen({ prediction, date, onBack }) {
  const chartData = {
    labels: [date],
    datasets: [
      {
        label: 'Predicted Sales',
        data: [prediction],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Predicción de Ventas',
        font: { size: 18 },
        color: '#1e293b',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="App">
      <h1>Resultado de la Predicción</h1>
      <div className="prediction-result">
        <p>Predicted Sales: <strong>{prediction}</strong></p>
        <button onClick={onBack}>Volver</button>
      </div>
      <div style={styles.chartContainer}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

const styles = {
  chartContainer: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
};

export default ResultScreen;
