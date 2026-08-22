# Simulador de Crédito Familiar

Una herramienta para que las familias simulen pagos de préstamos juntas. Vea cómo la contribución de cada persona forma la línea de tiempo de pago — un deslizador a la vez.

![License](https://img.shields.io/badge/license-GPLv3-blue)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/your-username/credit-simulator.git
cd credit-simulator

# Instalar dependencias (requiere pnpm)
pnpm install

# Abrir la aplicación
# Simplemente abra index.html en su navegador, o use un servidor local:
npx serve .
```

## Uso

### Parámetros del Préstamo

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| **Monto del Préstamo** | Dinero total prestado | $300.000.000 COP |
| **Plazo** | Número de meses para pagar | 60 meses (5 años) |
| **Tasa Mensual** | Tasa de interés mensual | 1.87% |
| **Tasa Anual (EA)** | Tasa efectiva anual (calculada automáticamente) | 25% EA |

Las tasas mensual y anual están vinculadas — editar una actualiza la otra automáticamente usando la convención de interés efectivo: `EA = (1 + mensual)^12 - 1`.

### Personas

Agregue miembros de la familia que contribuirán al pago del préstamo:

- **Nombre**: Identifica a cada persona
- **Porcentaje**: Cuánto del pago mensual paga cada persona (debe sumar 100%)
- **Extra/mes**: Contribución voluntaria adicional que acorta el préstamo

Haga clic en **+ Agregar Persona** para agregar hasta 6 personas. Haga clic en **Distribuir Equitativamente** para dividir los porcentajes en partes iguales.

### Moneda

Cambie entre **USD** y **COP** usando el selector de moneda. Los montos se formatean automáticamente:
- USD: $100,000.00 (2 decimales)
- COP: $100.000 (sin decimales, convención del peso colombiano)

### Gráfico

El gráfico muestra tres elementos visuales:

1. **Línea azul** — Saldo restante a lo largo del tiempo (curva descendente)
2. **Línea verde punteada** — Monto acumulado pagado (curva ascendente)
3. **Bandas de colores** — Áreas de contribución por persona (apiladas)

El **marcador amarillo** muestra el **punto de equilibrio** — el mes donde ha pagado más de lo que aún debe.

### Resumen de KPIs

Debajo del gráfico, cuatro métricas clave se actualian en tiempo real:

| KPI | Significado |
|-----|-------------|
| **Pago Mensual** | Monto fijo de la cuota mensual |
| **Pago Final** | Mes real de pago final (y meses ahorrados vs. plazo nominal) |
| **Equilibrio** | Mes donde el acumulado pagado ≥ saldo restante |
| **Interés Total** | Interés total pagado durante la vida del préstamo |

## Conceptos Clave

### Amortización

La amortización es el proceso de pagar un préstamo con pagos regulares fijos. Cada pago cubre dos partes:

1. **Interés** — Calculado sobre el saldo restante (mayor al inicio)
2. **Capital** — El resto del pago (reduce el saldo)

Esto se llama **sistema Price** (o amortización francesa). Los pagos iniciales son mayormente interés; los pagos finales son mayormente capital.

### Punto de Equilibrio

El punto de equilibrio es el mes donde sus **pagos acumulados exceden su saldo restante**. Antes de este punto, debe más de lo que ha pagado. Después de él, ha pagado más de lo que debe.

Este es un hito psicológico — significa que el préstamo está "mayormente pagado" aunque los pagos mensuales continúen.

### EA (Tasa Efectiva Anual)

La **Tasa Efectiva Anual (EA)** es la tasa de interés real anual, teniendo en cuenta la capitalización mensual. En Colombia, los préstamos de consumo típicamente van del 20–35% EA.

Fórmula: `EA = (1 + tasa_mensual)^12 - 1`

Ejemplo: Una tasa mensual del 1.87% equivale aproximadamente al 25% EA.

### Pagos Extra

Los pagos extra son contribuciones voluntarias adicionales que van directamente al capital. Ellos:

- **Acortan el plazo del préstamo** — Paga más rápido
- **Reducen el interés total** — Menos saldo significa menos interés acumulado
- **Desplazan el punto de equilibrio** — Ocurre antes

Cada persona puede establecer su propio monto extra mensual.

## Stack Tecnológico

- HTML/CSS/JavaScript vanilla (sin framework)
- Gráfico SVG (sin librería de gráficos)
- Sistema de diseño glassmorphism
- Jest para pruebas

## Licencia

GPLv3 — Ver [LICENSE](LICENSE) para detalles.
