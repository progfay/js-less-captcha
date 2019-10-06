const uuid = require('uuid/v4')
const express = require('express')
const app = express()

const compression = require('compression')
const bodyParser = require('body-parser')
app.use(compression({ level: 9 }))
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

const minifyHTML = (html, ...values) => (
  (html.raw ? String.raw(html, ...values) : html)
    .replace(/\s*\n\s*/gm, '')
    .replace(/\s+</g, '<')
    .replace(/>\s+/g, '>')
)

const minifyCSS = (css, ...values) => (
  (css.raw ? String.raw(css, ...values) : css)
    .replace(/\s*\n\s*/gm, '')
    .replace(/,\s+/g, ',')
    .replace(/:\s+/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*\{\s*/g, '{')
    .replace(/\s*\}\s*/g, '}')
    .replace(/;\}/g, '}')
)

const globalStyle = minifyCSS`
* {
  margin: 0;
  padding: 0;
}
`

const alignCenterStyle = minifyCSS`
.align-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
`

const bodyStyle = minifyCSS`
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  flex-direction: column;
  background: black;
  overscroll-behavior: none;
}`

const containerStyle = minifyCSS`
#container {
  width: 100vw;
  height: 40vh;
  margin-top: 20vh;
  flex-direction: row;
  letter-spacing: 5px;
}`

const charStyle = (id, index) => minifyCSS`
#${id} {
  order: ${index};
  animation: anime-${id} 1s ease ${random(1000)}ms infinite alternate;
  will-change: font-size, color, transform;
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

const formStyle = minifyCSS`
form#cert {
  width: 100vw;
  height: 20vh;
  margin-bottom: 20vh;
  flex-direction: row;
  user-select: none;
}
input#pass {
  box-sizing: border-box;
  height: 2.5vmin;
}
div#submit {
  width: 2.5vmin;
  line-height: 2.5vmin;
  margin-left: 1vmin;
  border: 1px solid white;
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
  color: white;
  font-size: 2vmin;
}
`

const renderToString = password => {
  const idList = new Array(password.length).fill(0).map(_ => `c-${uuid().slice(0, 8)}`)
  const style = [globalStyle, alignCenterStyle, bodyStyle, containerStyle, ...idList.map(charStyle), formStyle].join('')
  const chars = shuffle(password.split('').map((char, index) => minifyHTML`
    <span id="${idList[index]}"> ${char} </span>
  `)).join('')
  const form = minifyHTML`
    <form id="cert" class="align-center" action="/cert" method="post">
      <div class="align-center">
        <input id="pass" aria-label="pass" name="pass">
        <input type="hidden" name="timestamp" value="${TIMESTAMP}">
      </div>
      <div id="submit" onclick="document.getElementById('cert').submit()"> → </div>
    </form>
  `

  return minifyHTML`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title> js-less cert </title>
        <style> ${style} </style>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="Description" content="Please enter what you see, and certify.">
      </head>
      <body class="align-center">
        <p id="container" class="align-center"> ${chars} </p>
        ${form}
      </body>
    </html>
  `
}

let TIMESTAMP = Math.floor(new Date().getTime() / 1000).toString()
let PASSWORD = uuid()
let HTML = renderToString(PASSWORD)

setInterval(() => {
  TIMESTAMP = Math.floor(new Date().getTime() / 1000).toString()
  PASSWORD = uuid()
  HTML = renderToString(PASSWORD)
}, 3000)

app.get('/', (req, res) => {
  res.status(200).send(HTML)
})

app.post('/cert', (req, res) => {
  const { pass, timestamp } = req.body
  if (!pass || !timestamp) {
    res.status(401).send('Body parameter: pass, timestamp is required')
    return
  }

  if (TIMESTAMP !== timestamp) {
    res.status(401).send('Expired certification')
    return
  }

  if (PASSWORD === pass) {
    res.status(200).send(`Congrats! flag: ${FLAG}`)
  } else {
    res.sendStatus(401)
  }
})

app.listen(3000, () => { console.log('listen on http://localhost:3000') })
