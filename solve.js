const fetch = require('node-fetch')
const { JSDOM } = require('jsdom')

const ENDPOINT = 'http://localhost:3000'

fetch(ENDPOINT)
  .then(response => response.text())
  .then(html => new JSDOM(html))
  .then(({ window }) => ({
    timestamp: window.document.querySelector('input[name="timestamp"]').value,
    pass: Array.from(window.document.querySelectorAll('span'))
      .map(span => [
        parseInt(window.getComputedStyle(span).order, 10),
        span.innerHTML
      ])
      .sort((a, b) => a[0] - b[0])
      .map(v => v[1])
      .join('')
  }))
  .then(({ timestamp, pass }) => fetch(
    `${ENDPOINT}/captcha`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp, pass })
    }
  ))
  .then(response => response.text())
  .then(console.log)
  .catch(console.error)
