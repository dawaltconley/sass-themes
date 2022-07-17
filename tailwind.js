const plugin = require('tailwindcss/plugin')

const themeColor =
  property =>
  ({ opacityValue }) =>
    opacityValue === undefined
      ? `var(${property})`
      : `hsl(var(${property}-h) var(${property}-s) var(${property}-l) / ${opacityValue})`

module.exports = plugin(null, {
  theme: {
    extend: {
      colors: {
        'theme-tx': themeColor('--theme-tx'),
        'theme-bg': themeColor('--theme-bg'),
        'theme-br': themeColor('--theme-br'),
      },
    },
  },
})
