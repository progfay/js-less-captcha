const { random, randomColor, minifyCSS } = require('./utils')

module.exports.globalStyle = minifyCSS`
* {
  margin: 0;
  padding: 0;
}
`

module.exports.alignCenterStyle = minifyCSS`
.align-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
`

module.exports.bodyStyle = minifyCSS`
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  flex-direction: column;
  background: black;
  overscroll-behavior: none;
}`

module.exports.containerStyle = minifyCSS`
#container {
  width: 100vw;
  height: 40vh;
  margin-top: 20vh;
  flex-direction: row;
  letter-spacing: 5px;
}`

module.exports.charStyle = (id, index) => minifyCSS`
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

module.exports.formStyle = minifyCSS`
form#captcha {
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
