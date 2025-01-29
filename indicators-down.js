// @version=5
// Last update: 28-ene-2025 (by N)

indicator(title="TVI Down", shorttitle="TVI X", format=format.price, precision=2)


// RSI (Relative Strength Index) ----------------------------------------------

len = input.int(14, minval=1, title="Length", group="RSI")
srcZ = input.source(close, title="Source", group="RSI")
up = ta.rma(math.max(ta.change(srcZ), 0), len)
down = ta.rma(-math.min(ta.change(srcZ), 0), len)
rsi = down == 0 ? 100 : up == 0 ? 0 : 100 - (100 / (1 + up / down))

plot(rsi, "RSI - line", color=color.new(color.yellow, 0), style=plot.style_circles)
band1  = hline(80, "RSI - upper", color=color.new(color.orange, 0), linestyle=hline.style_solid)
band0  = hline(20, "RSI - lower", color=color.new(color.blue, 0), linestyle=hline.style_solid)
banda1 = hline(50, "RSI - medium", color=color.new(color.white, 0))
banda3 = hline(55, "RSI - band", color=color.new(color.orange, 0), linestyle=hline.style_dotted)
banda4 = hline(45, "RSI - band", color=color.new(color.blue, 0), linestyle=hline.style_dotted)


// Stochastic -----------------------------------------------------------------

periodK = input.int(14, title="%K length", minval=1, group="Stoch")
smoothK = input.int(6, title="%K smoothing", minval=1, group="Stoch")
periodD = input.int(3, title="%D smoothing", minval=1, group="Stoch")
k = ta.sma(ta.stoch(close, high, low, periodK), smoothK)
d = ta.sma(k, periodD)

plot(k, title="Stoch - %K", color=color.new(color.blue, 0))
plot(d, title="Stoch - %D", color=color.new(color.orange, 0))
h0 = hline(80, "Stoch - upper band", color=color.new(color.gray, 0), linestyle=hline.style_dotted)
h1 = hline(20, "Stoch - lower band", color=color.new(color.gray, 0), linestyle=hline.style_dotted)
fill(h0, h1, color=color.rgb(49, 27, 146, 95), title="Stoch - background")


// MACD Crossover -------------------------------------------------------------

fast_length = input.int(title="Fast length", defval=12, group="MACD")
slow_length = input.int(title="Slow length", defval=26, group="MACD")
srcX = input.source(title="Source", defval=close, group="MACD")
signal_length = input.int(title="Signal smoothing", minval=1, maxval=50, defval=9, group="MACD")
sma_source = input.bool(title="Simple MA, oscillator", defval=false, group="MACD")
sma_signal = input.bool(title="Simple MA, signal line", defval=false, group="MACD")
fast_ma = sma_source ? ta.sma(srcX, fast_length) : ta.ema(srcX, fast_length)
slow_ma = sma_source ? ta.sma(srcX, slow_length) : ta.ema(srcX, slow_length)
macd = fast_ma - slow_ma
signal = sma_signal ? ta.sma(macd, signal_length) : ta.ema(macd, signal_length)
hist = macd - signal

col_grow_above = color.new(color.teal, 0)
col_grow_below = color.new(color.gray, 0)
col_fall_below = color.new(color.red, 0)
col_fall_above = color.new(color.gray, 0)
col_macd = color.new(color.blue, 0)
col_signal = color.new(color.orange, 0)
col_level = color.new(color.white, 0)
hline(0, title="MACD - level", color=col_level, linewidth=1)
plot(hist, title="MACD - histogram", style=plot.style_area, color=(hist >= 0 ? (hist[1] < hist ? col_grow_above : col_fall_above) : (hist[1] < hist ? col_grow_below : col_fall_below)))
plot(macd, title="MACD - MACD line", color=col_macd, linewidth=2)
plot(signal, title="MACD - signal line", color=col_signal, linewidth=2)
barcolor(hist <= 0 ? color.new(color.red, 0) : hist >= 0 ? color.new(color.green, 0) : color.new(color.rgb(42, 46, 57, 0), 0), title="MACD (Bar color)")


// Absolute Strength Histogram ------------------------------------------------

Length = input.int(9, title="Period of evaluation [16, 9]", group="ASH")
Smooth = input.int(3, title="Period of smoothing [4, 3]", group="ASH")
src = input.source(close, title="Source", group="ASH")
Mode = input.string(title="Indicator method", defval="RSI", options=["RSI", "STOCHASTIC", "ADX"], group="ASH")
ma_type = input.string(title="Moving average", defval="EMA", options=["ALMA", "EMA", "WMA", "SMA", "SMMA", "HMA"], group="ASH")
alma_offset = input.float(defval=0.85, title="Offset value *[ALMA only]", minval=0, step=0.01, group="ASH")
alma_sigma = input.int(defval=6, title="Sigma value *[ALMA only]", minval=0, group="ASH")
show_histo = input.bool(true, title="Show histogram", group="ASH")

ma(type, src, len) =>
    float result = 0
    if type == "SMA"  // Simple
        result := ta.sma(src, len)
    if type == "EMA"  // Exponential
        result := ta.ema(src, len)
    if type == "WMA"  // Weighted
        result := ta.wma(src, len)
    if type == "SMMA"  // Smoothed
        w = ta.wma(src, len)
        result := na(w[1]) ? ta.sma(src, len) : (w[1] * (len - 1) + src) / len
    if type == "HMA"  // Hull
        result := ta.wma(2 * ta.wma(src, len / 2) - ta.wma(src, len), math.round(math.sqrt(len)))
    if type == "ALMA"  // Arnaud Legoux
        result := ta.alma(src, len, alma_offset, alma_sigma)
    result

Price = src
Price1 = ma("SMA", Price, 1)
Price2 = ma("SMA", Price[1], 1)

// RSI
Bulls0 = 0.5 * (math.abs(Price1 - Price2) + (Price1 - Price2))
Bears0 = 0.5 * (math.abs(Price1 - Price2) - (Price1 - Price2))

// STOCHASTIC
Bulls1 = Price1 - ta.lowest(Price1, Length)
Bears1 = ta.highest(Price1, Length) - Price1

// ADX
Bulls2 = 0.5 * (math.abs(high - high[1]) + (high - high[1]))
Bears2 = 0.5 * (math.abs(low[1] - low) + (low[1] - low))
Bulls = Mode == "RSI" ? Bulls0 : Mode == "STOCHASTIC" ? Bulls1 : Bulls2
Bears = Mode == "RSI" ? Bears0 : Mode == "STOCHASTIC" ? Bears1 : Bears2
AvgBulls = ma(ma_type, Bulls, Length)
AvgBears = ma(ma_type, Bears, Length)
SmthBulls = ma(ma_type, AvgBulls, Smooth)
SmthBears = ma(ma_type, AvgBears, Smooth)
difference = math.abs(SmthBulls - SmthBears)
difference_color = difference > SmthBulls ? ((SmthBears < SmthBears[1]) ? color.new(color.red, 0) : color.new(color.red, 0)) : difference > SmthBears ? ((SmthBulls < SmthBulls[1]) ? color.new(color.yellow, 0) : color.new(color.yellow, 0)) : color.new(color.rgb(19, 23, 34, 0), 0)

plot(difference, style=plot.style_histogram, linewidth=3, color=show_histo ? difference_color : na, title="ASH - Strength")

