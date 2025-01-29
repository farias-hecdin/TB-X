# TB-X: Indicadores para TradingView

Este repositorio contiene una compilación de indicadores para TradingView, diseñados para ser añadidos tanto al panel principal de precio como al panel auxiliar.

## 🗒️ Indicadores

Los indicadores se dividen en dos categorías: aquellos que se superponen al gráfico de precios y aquellos que se muestran en un panel separado.

### Panel principal de precio

Estos indicadores se visualizan directamente sobre el gráfico de precios:

| Nombre          | Descripción                                                                    |
|-----------------|--------------------------------------------------------------------------------|
| EMA x2          | Dos Medias Móviles Exponenciales (EMA) configurables.                             |
| ATR             | Rango Medio Verdadero (Average True Range). Mide la volatilidad del activo.     |
| DC              | Canales de Donchian (Donchian Channels). Representa el máximo y mínimo de un período. |
| S/R             | Soporte y Resistencia (Support and Resistance). Dibuja niveles clave de S/R.   |
| HMA             | Media Móvil de Hull (Hull Moving Average). Suaviza la acción del precio.        |
| ST              | Supertrend. Sigue la tendencia principal del precio.                            |
| ICH             | Nube de Ichimoku (Ichimoku Cloud). Indicador completo de tendencia y momentum. |
| Weekend         | Resalta los fines de semana en el gráfico.                                     |

### Panel auxiliar

Estos indicadores se visualizan en un panel separado debajo del gráfico de precios:

| Nombre          | Descripción                                                                                                       |
|-----------------|--------------------------------------------------------------------------------------------------------------------|
| RSI             | Índice de Fuerza Relativa (Relative Strength Index). Mide la magnitud de los cambios recientes en el precio.      |
| Stochastic      | Oscilador Estocástico. Compara el precio de cierre con un rango de precios durante un período determinado.         |
| MACD            | Convergencia/Divergencia de la Media Móvil (Moving Average Convergence Divergence). Muestra la relación entre dos EMAs. |
| ASH             | Histograma de Fuerza Absoluta (Absolute Strength Histogram). Mide la fuerza de los compradores frente a los vendedores. |

## 🗒️ Instalación

Para utilizar estos indicadores en TradingView, necesitas copiar el código fuente de cada indicador individualmente y pegarlo en el editor de Pine Script de TradingView.

**Pasos:**

1. **Accede al código fuente:** Navega a la carpeta de cada indicador dentro de este repositorio y abre el archivo `.pine` correspondiente.
3. **Abre el editor de Pine Script:** En TradingView, abre un gráfico y haz clic en "Editor de Pine Script" en la parte inferior de la pantalla.
4. **Pega el código:** Pega el código copiado en el editor de Pine Script.
5. **Guarda el indicador:** Haz clic en "Guardar" y dale un nombre al indicador.
6. **Añade el indicador al gráfico:** Haz clic en "Añadir al gráfico".

## 🛡️ Licencia

TB-X está bajo la licencia MIT. Consulta el archivo `LICENSE` para obtener más información.
