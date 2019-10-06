const uuid = require('uuid/v4')
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const renderToString = require('./html')
const FLAG = require('./flag')

const app = express()
app.use(compression({ level: 9 }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let TIMESTAMP = Math.floor(new Date().getTime() / 1000).toString()
let PASSWORD = uuid()
let HTML = renderToString(PASSWORD, TIMESTAMP)

setInterval(() => {
  TIMESTAMP = Math.floor(new Date().getTime() / 1000).toString()
  PASSWORD = uuid()
  HTML = renderToString(PASSWORD, TIMESTAMP)
}, 3000)

app.get('/', (req, res) => { res.status(200).send(HTML) })

app.post('/captcha', (req, res) => {
  const { pass, timestamp } = req.body
  if (!pass || !timestamp) return res.status(401).send('Body parameter: pass, timestamp is required')
  if (TIMESTAMP !== timestamp) return res.status(401).send('Expired timestamp, enter within 3 seconds')
  if (PASSWORD !== pass) return res.sendStatus(401).send('Wrong password')
  return res.status(200).send(`Congrats! flag: ${FLAG}`)
})

app.listen(3000, () => { console.log('listen on http://localhost:3000') })
