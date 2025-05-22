function ResultScreen({ prediction, onBack }) {
  const { linearPrediction, svmPrediction } = prediction;

  return (
    <div className="App">
      <h1>Resultados de Predicción</h1>

      <div className="grid-result">
        <div className="result-box">
          <h2>Regresión Lineal</h2>
          <p>Unidades estimadas: <strong>{linearPrediction}</strong></p>
        </div>

        <div className="result-box">
          <h2>Regresión SVM</h2>
          <p>Unidades estimadas: <strong>{svmPrediction}</strong></p>
        </div>
      </div>

      <button onClick={onBack}>⬅ Volver</button>
    </div>
  );
}

export default ResultScreen;
