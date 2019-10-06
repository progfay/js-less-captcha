const uuid = require('uuid/v4')
const { shuffle, minifyHTML } = require('./utils')
const { globalStyle, alignCenterStyle, bodyStyle, containerStyle, charStyle, formStyle } = require('./style')

module.exports = (password, timestamp) => {
  const idList = new Array(password.length).fill(0).map(_ => `c-${uuid().slice(0, 8)}`)
  const style = [globalStyle, alignCenterStyle, bodyStyle, containerStyle, ...idList.map(charStyle), formStyle].join('')
  const chars = shuffle(password.split('').map((char, index) => minifyHTML`
    <span id="${idList[index]}"> ${char} </span>
  `)).join('')

  return minifyHTML`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title> js-less CAPTCHA </title>
        <style> ${style} </style>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="Description" content="Please enter what you see, and pass CAPTCHA.">
      </head>
      <body class="align-center">
        <p id="container" class="align-center"> ${chars} </p>
        <form id="captcha" class="align-center" action="/captcha" method="post">
          <div class="align-center">
            <input id="pass" aria-label="pass" name="pass">
            <input type="hidden" name="timestamp" value="${timestamp}">
          </div>
          <div id="submit" onclick="document.getElementById('captcha').submit()"> → </div>
        </form>
      </body>
    </html>
  `
}
