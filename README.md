Informe de Preparación del Dataset para Modelado de Predicción de Ventas
1. Objetivo del Proyecto
El propósito de este trabajo es construir un modelo capaz de predecir la cantidad de unidades vendidas (item_cnt_month) para combinaciones específicas de producto y tienda durante el mes de noviembre de 2015, a partir del histórico de ventas provisto.

2. Análisis Exploratorio de Datos (EDA)
Se realizó un análisis exhaustivo sobre todos los archivos incluidos en el dataset original:

sales_train.csv: datos de ventas diarias históricas. Se limpiaron registros con precios negativos, cantidades negativas y valores atípicos extremos.

items.csv, item_categories.csv, shops.csv: se validaron estructuras, duplicados, relaciones cruzadas y cobertura frente al conjunto de ventas.

test.csv: se verificó que las combinaciones (shop_id, item_id) fuesen consistentes con el histórico.

sample_submission.csv: se entendió como plantilla para las predicciones finales.

3. Limpieza y depuración
El archivo sales_train.csv fue depurado en profundidad, eliminando registros con:

Precios menores o iguales a 0

Cantidades de venta negativas

Valores de precio superiores a 100,000

Ventas superiores a 1,000 unidades por día

Este nuevo dataset se guardó como sales_clean.

4. Construcción del dataset mensual
Se consolidaron las ventas diarias en un dataset mensual por combinación (shop_id, item_id, date_block_num) que representa las unidades vendidas en cada mes, denominado item_cnt_month. Para el conjunto de prueba (test.csv), se generó un subconjunto con date_block_num = 34, asignando item_cnt_month = 0 como marcador para predicción.

5. Enriquecimiento con features
Se añadieron variables adicionales al dataset con el fin de mejorar el desempeño de los modelos, especialmente aquellos basados en regresión:

Promedio histórico de ventas por producto (item_avg_cnt_day)

Promedio histórico de ventas por tienda (shop_avg_cnt_day)

Promedio de ventas por categoría (cat_avg_cnt_day)

Ventas del mes anterior (item_cnt_month_lag1)

Total de registros de venta por producto (item_total_sales)

Frecuencia de venta por combinación tienda-producto (shop_item_freq)

Número de meses en que el producto ha sido vendido (item_months_sold)

Todas estas características fueron generadas a partir de sales_clean.

6. Dataset final: full_data
El resultado final de este proceso es el dataset full_data, que contiene:

Variables de identificación: date_block_num, shop_id, item_id, item_category_id

Variable objetivo: item_cnt_month

Variables de contexto: medias, lags, frecuencia de ventas

Este dataset contiene 1,822,425 registros, incluyendo los 214,200 del conjunto de prueba.

Guía para el uso de full_data
Separar datos para entrenamiento y prueba:

Entrenamiento: full_data[full_data['date_block_num'] < 34]

Prueba: full_data[full_data['date_block_num'] == 34]

Seleccionar features numéricas relevantes, excluyendo columnas identificadoras (shop_id, item_id, item_category_id) si el modelo no las admite directamente.

Estandarizar los datos si se usará Regresión Lineal o SVM, utilizando por ejemplo StandardScaler de sklearn.

Entrenar el modelo usando item_cnt_month como variable objetivo.

Predecir para el conjunto de prueba y generar el archivo submission.csv siguiendo el formato de sample_submission.csv.

Archivos generados
sales_clean.csv: ventas limpias y depuradas

full_data_features.csv: dataset enriquecido para modelado, listo para uso local o