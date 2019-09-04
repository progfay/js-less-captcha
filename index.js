const uuid = require('uuid/v4')
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const FLAG = 'flag{**********}'

const shuffle = _array => {
  const array = [..._array]
  for (let i = array.length - 1; i > 0; i--) {
    let r = Math.floor(Math.random() * (i + 1))
    let tmp = array[i]
    array[i] = array[r]
    array[r] = tmp
  }
  return array
}

const random = (value) => ~~(Math.random() * value)
const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`

const bodyStyle = `
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: black;
}`

const containerStyle = `
#container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  letter-spacing: 5px;
}`

const charStyle = (id, index) => `
span#${id} {
  order: ${index};
  animation: anime-${id} 1s ease ${random(1000)}ms infinite alternate;
  will-change: transform;
}
@keyframes anime-${id} {
  0% {
    font-size: ${random(10) + 15}px;
    color: ${randomColor()}; opacity: 0;
    transform: translate3d(${random(10) - 5}px, ${random(10) - 5}px, ${random(10) - 5}px) rotate(${random(60) - 30}deg);
  }
  100% {
    font-size: ${random(10) + 15}px;
    color: ${randomColor()}; opacity: 1;
    transform: translate3d(${random(10) - 5}px, ${random(10) - 5}px, ${random(10) - 5}px) rotate(${random(60) - 30}deg);
  }
}`

const formStyle = `
form {
  display: flex;
  flex-direction: row;
  user-select: none;
}`

const renderToString = password => {
  const idList = new Array(password.length).fill(0).map(_ => `char-${uuid()}`)
  const style = bodyStyle + containerStyle + idList.map(charStyle).join('\n') + formStyle
  const chars = shuffle(password.split('').map((char, index) => `<span id="${idList[index]}">${char}</span>`)).join('')
  const form = '<form action="/cert" method="post"><div><input name="pass"></div><button>Certificate</button></form>'
  return `<head><style>${style}</style></head><body><p id="container">${chars}</p>${form}</body>`
}

let PASSWORD = uuid()
let HTML = renderToString(PASSWORD)

setInterval(() => {
  PASSWORD = uuid()
  HTML = renderToString(PASSWORD)
}, 3000)

app.get('/', (req, res) => {
  res.status(200).send(HTML)
})

app.post('/cert', (req, res) => {
  const { pass } = req.body
  if (PASSWORD === pass) {
    res.status(200).send(`Congrats! flag: ${FLAG}`)
  } else {
    res.sendStatus(401)
  }
})

app.listen(3000, () => { console.log('listen on http://localhost:3000') })
