/**
 * SVG chart renderer.
 * Draws balance curve, cumulative-paid curve, per-person bands, and equilibrium marker.
 */

import { formatCurrency } from '../engine/format.js'

const SVG_NS = 'http://www.w3.org/2000/svg'

export function initChart (store, svgEl) {
  const padding = { top: 30, right: 30, bottom: 50, left: 80 }

  function render (state) {
    const { result, currency } = state
    if (!result || !result.ok) return

    const { schedule, equilibrium } = result
    if (!schedule || schedule.length === 0) return

    const width = svgEl.clientWidth || 800
    const height = svgEl.clientHeight || 400
    const chartW = width - padding.left - padding.right
    const chartH = height - padding.top - padding.bottom

    // Clear
    svgEl.innerHTML = ''

    // Scales
    const maxMonth = schedule.length
    const maxBalance = schedule[0].balance + schedule[0].interest
    const xScale = (month) => padding.left + (month / maxMonth) * chartW
    const yScale = (value) => padding.top + chartH - (value / maxBalance) * chartH

    // Axes
    drawAxes(svgEl, padding, chartW, chartH, maxMonth, maxBalance, currency)

    // Per-person stacked bands
    drawPersonBands(svgEl, schedule, state.persons, xScale, yScale, maxBalance)

    // Balance curve
    drawCurve(svgEl, schedule, 'balance', xScale, yScale, 'var(--color-accent)', 'balance-curve')

    // Cumulative paid curve
    drawCumulativeCurve(svgEl, schedule, xScale, yScale, 'var(--color-success)', 'cumulative-curve')

    // Equilibrium marker
    if (equilibrium) {
      drawEquilibriumMarker(svgEl, equilibrium, xScale, yScale, currency)
    }
  }

  function drawAxes (svg, padding, chartW, chartH, maxMonth, maxBalance, currency) {
    // X axis
    const xAxis = createLine(padding.left, padding.top + chartH, padding.left + chartW, padding.top + chartH, 'var(--color-text-muted)', 1)
    svg.appendChild(xAxis)

    // X axis labels
    const xSteps = Math.min(maxMonth, 12)
    for (let i = 0; i <= xSteps; i++) {
      const month = Math.round((i / xSteps) * maxMonth)
      const x = padding.left + (month / maxMonth) * chartW
      const label = createText(x, padding.top + chartH + 20, `${month}`, 'var(--color-text-muted)', 'middle')
      svg.appendChild(label)
    }

    // X axis title
    const xTitle = createText(padding.left + chartW / 2, padding.top + chartH + 40, 'Months', 'var(--color-text-muted)', 'middle')
    svg.appendChild(xTitle)

    // Y axis
    const yAxis = createLine(padding.left, padding.top, padding.left, padding.top + chartH, 'var(--color-text-muted)', 1)
    svg.appendChild(yAxis)

    // Y axis labels
    const ySteps = 5
    for (let i = 0; i <= ySteps; i++) {
      const value = (i / ySteps) * maxBalance
      const y = padding.top + chartH - (value / maxBalance) * chartH
      const label = createText(padding.left - 10, y + 4, formatCurrency(value, currency), 'var(--color-text-muted)', 'end')
      svg.appendChild(label)
    }
  }

  function drawCurve (svg, schedule, field, xScale, yScale, color, className) {
    const points = schedule.map((row, i) => `${xScale(i + 1)},${yScale(row[field])}`)
    const path = document.createElementNS(SVG_NS, 'path')
    path.setAttribute('d', `M${points.join('L')}`)
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', color)
    path.setAttribute('stroke-width', '2.5')
    path.setAttribute('class', className)
    svg.appendChild(path)
  }

  function drawCumulativeCurve (svg, schedule, xScale, yScale, color, className) {
    let cumulative = 0
    const points = schedule.map((row, i) => {
      cumulative += row.installment + row.extra
      return `${xScale(i + 1)},${yScale(cumulative)}`
    })
    const path = document.createElementNS(SVG_NS, 'path')
    path.setAttribute('d', `M${points.join('L')}`)
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', color)
    path.setAttribute('stroke-width', '2')
    path.setAttribute('stroke-dasharray', '6,3')
    path.setAttribute('class', className)
    svg.appendChild(path)
  }

  function drawPersonBands (svg, schedule, persons, xScale, yScale, maxBalance) {
    const colors = ['rgba(56,189,248,0.3)', 'rgba(52,211,153,0.3)', 'rgba(251,191,36,0.3)', 'rgba(248,113,113,0.3)', 'rgba(167,139,250,0.3)', 'rgba(251,146,60,0.3)']

    for (let p = 0; p < persons.length; p++) {
      let cumulative = 0
      const points = schedule.map((row, i) => {
        cumulative += row.persons[p].share + row.persons[p].extra
        return `${xScale(i + 1)},${yScale(cumulative)}`
      })

      // Close the path at the bottom
      const firstX = xScale(1)
      const lastX = xScale(schedule.length)
      const bottomY = yScale(0)

      const path = document.createElementNS(SVG_NS, 'path')
      path.setAttribute('d', `M${firstX},${bottomY}L${points.join('L')}L${lastX},${bottomY}Z`)
      path.setAttribute('fill', colors[p % colors.length])
      path.setAttribute('class', `person-band-${p}`)
      svg.appendChild(path)
    }
  }

  function drawEquilibriumMarker (svg, eq, xScale, yScale, currency) {
    const x = xScale(eq.month)
    const y = yScale(eq.balance)

    // Vertical line
    const line = createLine(x, y, x, yScale(0), 'var(--color-warning)', 1, '4,4')
    svg.appendChild(line)

    // Circle marker
    const circle = document.createElementNS(SVG_NS, 'circle')
    circle.setAttribute('cx', x)
    circle.setAttribute('cy', y)
    circle.setAttribute('r', '6')
    circle.setAttribute('fill', 'var(--color-warning)')
    circle.setAttribute('class', 'equilibrium-marker')
    svg.appendChild(circle)

    // Label
    const label = createText(x, y - 15, `Month ${eq.month}`, 'var(--color-warning)', 'middle')
    label.setAttribute('font-weight', 'bold')
    svg.appendChild(label)
  }

  function createLine (x1, y1, x2, y2, color, width, dash) {
    const line = document.createElementNS(SVG_NS, 'line')
    line.setAttribute('x1', x1)
    line.setAttribute('y1', y1)
    line.setAttribute('x2', x2)
    line.setAttribute('y2', y2)
    line.setAttribute('stroke', color)
    line.setAttribute('stroke-width', width)
    if (dash) line.setAttribute('stroke-dasharray', dash)
    return line
  }

  function createText (x, y, text, color, anchor) {
    const el = document.createElementNS(SVG_NS, 'text')
    el.setAttribute('x', x)
    el.setAttribute('y', y)
    el.setAttribute('fill', color)
    el.setAttribute('text-anchor', anchor)
    el.setAttribute('font-size', '12')
    el.setAttribute('font-family', 'var(--font-mono)')
    el.textContent = text
    return el
  }

  store.subscribe(render)

  // Initial render
  render(store.getState())
}
