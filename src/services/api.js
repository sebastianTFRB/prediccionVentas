export const fetchSalesPrediction = async ({ productId, shopId, categoryId, price, month }) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/forecast_sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item_id: parseInt(productId),
      shop_id: parseInt(shopId),
      item_category_id: parseInt(categoryId),
      item_price: parseFloat(price),
      month: parseInt(month),
    }),
  });

  if (!response.ok) {
    throw new Error('Error al obtener la predicción');
  }

  const data = await response.json();
  return data.predicted_sales;
};
