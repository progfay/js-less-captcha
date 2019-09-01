const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')

fetch('http://localhost:3000')
  .then(response => response.text())
  .then(html => new JSDOM(html))
  .then(({ window }) => (
    Array.from(window.document.querySelectorAll('span'))
      .map(span => [
        parseInt(window.getComputedStyle(span).order, 10),
        span.innerHTML
      ])
      .sort((a, b) => a[0] - b[0])
      .map(v => v[1])
      .join('')
  ))
  .then(pass => fetch(
    'http://localhost:3000/cert',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pass })
    }
  ))
  .then(response => response.text())
  .then(console.log)
  .catch(console.error)
