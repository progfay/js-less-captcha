module.exports.shuffle = _array => {
  const array = [..._array]
  for (let i = array.length - 1; i > 0; i--) {
    let r = Math.floor(Math.random() * (i + 1))
    let tmp = array[i]
    array[i] = array[r]
    array[r] = tmp
  }
  return array
}

module.exports.random = (value) => ~~(Math.random() * value)
module.exports.randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`

module.exports.minifyHTML = (html, ...values) => (
  (html.raw ? String.raw(html, ...values) : html)
    .replace(/\s*\n\s*/gm, '')
    .replace(/\s+</g, '<')
    .replace(/>\s+/g, '>')
)

module.exports.minifyCSS = (css, ...values) => (
  (css.raw ? String.raw(css, ...values) : css)
    .replace(/\s*\n\s*/gm, '')
    .replace(/,\s+/g, ',')
    .replace(/:\s+/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*\{\s*/g, '{')
    .replace(/\s*\}\s*/g, '}')
    .replace(/;\}/g, '}')
)
