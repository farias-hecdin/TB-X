// @version=5
// Last update: 28-ene-2025 (by N)

indicator(title="TVI Top", shorttitle="TVI Y", overlay=true)


// Weekend -----------------------------------------------------------------

bgcolor(dayofweek == 7 ? #7f7fff : dayofweek == 1 ? #EDDC01 : na)


// EMA (Moving Average Exponential) ----------------------------------------

// EMA 1
lenEma_NjS = input.int(defval=50, minval=0, title="Length", group="EMA")
srcEma_NjS = input.source(close, title="Source", group="EMA")
ema_NjS = ta.ema(srcEma_NjS, lenEma_NjS)

plot(ema_NjS, color=color.white, linewidth=1, title="EMA 1")

// EMA 2
lenEma_4NW = input.int(defval=100, minval=0, title="Length", group="EMA 2")
srcEma_4NW = input.source(close, title="Source", group="EMA 2")
ema_4NW = ta.ema(srcEma_4NW, lenEma_4NW)

plot(ema_4NW, color=color.white, linewidth=1, title="EMA 2")


// S/R (Support and Resistance) --------------------------------------------

left = input.int(defval=3, title="Left", group="S/R")
right = input.int(defval=3, title="Right", group="S/R")
hih = ta.pivothigh(high, left, right)
lol = ta.pivotlow(low, left, right)
top = ta.valuewhen(hih, high[right], 0)
bot = ta.valuewhen(lol, low[right], 0)

plot(top, color=top != top[1] ? na : color.new(color.yellow, 0), offset=-left, title="S/R - resistance")
plot(bot, color=bot != bot[1] ? na : color.new(color.yellow, 0), offset=-left, title="S/R - support")


// DC (Donchian Channels) --------------------------------------------------

length = input.int(defval=20, minval=1, title="Length", group="DC")
lower = ta.lowest(length)
upper = ta.highest(length)
basis = math.avg(upper, lower)

p_basis = plot(basis, "DC - basis", color=color.new(color.teal, 0))
p_upper = plot(upper, "DC - upper", color=color.new(color.blue, 0))
p_lower = plot(lower, "DC - lower", color=color.new(color.orange, 0))
fill(p_upper, p_lower, color=color.rgb(33, 150, 243, 95), title="DC - background")


// ATR (Average True Range) ------------------------------------------------

lenATR = input.int(defval=14, minval=1, title="Period", group="ATR")
multiplier_4NW = input.float(defval=1.5, minval=0.1, step=0.1, title="Multiplier", group="ATR")
shortStopLoss = close + ta.atr(lenATR) * multiplier_4NW
longStopLoss = close - ta.atr(lenATR) * multiplier_4NW

plot(shortStopLoss, color=color.new(color.black, 0), style=plot.style_cross, title="ATR - short")
plot(longStopLoss, color=color.new(color.black, 0), style=plot.style_cross, title="ATR - long")


// HMA (Hull Moving Average) -----------------------------------------------

hmaLength = input.int(title="length", defval=25, group="HMA")
tf = input.timeframe(title="timeframe", defval="", group="HMA")
source = input(close, title="source", group="HMA")
hullma = ta.wma(2 * ta.wma(source, hmaLength/2) - ta.wma(source, hmaLength), math.floor(math.sqrt(hmaLength)))
hma = request.security(syminfo.tickerid, timeframe=tf, expression=hullma, gaps=barmerge.gaps_off, lookahead=barmerge.lookahead_off)

plot(hma, title="HMA", color=color.yellow, linewidth=2)


// ST (Supertrend) ---------------------------------------------------------

periods = input.int(title="ATR period", defval=10, group="Supertrend")
multiplier = input.float(title="ATR multiplier", step=0.1, defval=1.7, group="Supertrend")
changeATR = input.bool(title="Change ATR calculation method", defval=false, group="Supertrend")
src = input.source(hl2, title="Source", group="Supertrend")

atr2 = ta.sma(ta.tr, periods)
atr = changeATR ? ta.atr(periods) : atr2
up = src - (multiplier * atr)
up1 = nz(up[1], up)
up := close[1] > up1 ? math.max(up, up1) : up
dn = src + (multiplier * atr)
dn1 = nz(dn[1], dn)
dn := close[1] < dn1 ? math.min(dn, dn1) : dn
trend = 1
trend := nz(trend[1], trend)
trend := trend == -1 and close > dn1 ? 1 : trend == 1 and close < up1 ? -1 : trend

upPlot = plot(trend == 1 ? up : na, title="ST - upTrend", style=plot.style_linebr, linewidth=2, color=color.new(color.blue, 0))
dnPlot = plot(trend == 1 ? na : dn, title="ST - downTrend", style=plot.style_linebr, linewidth=2, color=color.new(color.rgb(42, 46, 57, 0), 0))

// ICH (Ichimoku cloud) ----------------------------------------------------

conversionPeriods = input.int(defval=10, minval=1, title="Conversion line, (kijun-sen)", group="Ichimoku")
basePeriods = input.int(defval=30, minval=1, title="Base line, (kijun-sen)", group="Ichimoku")
laggingSpan2Periods = input.int(defval=60, minval=1, title="Leading span B, (senkou span B)", group="Ichimoku")
displacement = input.int(defval=30, minval=1, title="Displacement", group="Ichimoku")

donchian(len) => math.avg(ta.lowest(len), ta.highest(len))
conversionLine = donchian(conversionPeriods)
baseLine = donchian(basePeriods)
leadLine1 = math.avg(conversionLine, baseLine)
leadLine2 = donchian(laggingSpan2Periods)

plot(conversionLine, color=color.new(color.yellow, 0), title="ICH - conversion line")
plot(baseLine, color=color.new(color.red, 0), title="ICH - base line")
plot(close, color=color.new(color.navy, 0), title="ICH - lagging span", offset=-displacement + 1, linewidth=2)
plot(ta.cross(conversionLine, baseLine) ? conversionLine : na, color=color.new(color.white, 0), style=plot.style_cross, linewidth=4, title="ICH - cross")
p1 = plot(leadLine1, offset=displacement - 1, color=color.new(color.green, 0), title="ICH - Leading span A")
p2 = plot(leadLine2, offset=displacement - 1, color=color.new(color.red, 0), title="ICH - Leading span B")
fill(p1, p2, color=leadLine1 > leadLine2 ? color.rgb(0, 77, 64, 50) : color.rgb(183, 28, 28, 50), title="ICH - kumo")

