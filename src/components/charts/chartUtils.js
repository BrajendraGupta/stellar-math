/** Linear scale: map a value from [domainMin,domainMax] to [rangeMin,rangeMax] */
export function normalizeToPixel(value, domainMin, domainMax, rangeMin, rangeMax) {
  if (domainMax === domainMin) return rangeMin
  return rangeMin + ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin)
}

/** Format a YYYY-MM-DD string to a short label like "Apr 1" */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Format to just day-of-week abbrev: "Mon", "Tue" */
export function formatDayAbbr(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}
