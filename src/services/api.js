const API = import.meta.env.VITE_API_URL;

export const fetchCombinedPrediction = async (features) => {
  const [linearRes, svmRes] = await Promise.all([
    fetch(`${API}/forecast_sales/linear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features),
    }),
    fetch(`${API}/forecast_sales/svm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features),
    }),
  ]);

  if (!linearRes.ok || !svmRes.ok) {
    throw new Error('Error en una o ambas predicciones');
  }

  const linearData = await linearRes.json();
  const svmData = await svmRes.json();

  return {
    linearPrediction: linearData.predicted_sales,
    svmPrediction: svmData.predicted_sales
  };
};
