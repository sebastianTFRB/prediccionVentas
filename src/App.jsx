// src/App.jsx
import { useState } from 'react';
import FormScreen from './FormScreen';
import ResultScreen from './ResultScreen';
import { fetchSalesPrediction } from './services/api';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [inputData, setInputData] = useState(null);

  const handleSubmit = async ({ productId, shopId, categoryId, price, month }) => {
    try {
      const predictionResult = await fetchSalesPrediction({
        productId,
        shopId,
        categoryId,
        price,
        month,
      });
      setPrediction(predictionResult);
      setInputData({ month });
    } catch (err) {
      console.error('Error en la predicción:', err);
      setPrediction('Error al obtener predicción');
    }
  };
  
  

  const handleBack = () => {
    setPrediction(null);
    setInputData(null);
  };

  return prediction !== null && inputData ? (
    <ResultScreen prediction={prediction} date={inputData.date} onBack={handleBack} />
  ) : (
    <FormScreen onSubmit={handleSubmit} />
  );
}

export default App;
