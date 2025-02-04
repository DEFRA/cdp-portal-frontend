const chartColours = new Map()

chartColours.set('red', 'rgb(212, 53, 28)')
chartColours.set('yellow', 'rgb(255, 221, 0)')
chartColours.set('green', 'rgb(0, 112, 60)')
chartColours.set('blue', 'rgb(29, 112, 184)')
chartColours.set('dark-blue', 'rgb(0, 48, 120)')
chartColours.set('light-blue', 'rgb(86, 148, 202)')
chartColours.set('purple', 'rgb(76, 44, 146)')
chartColours.set('light-purple', 'rgb(111, 114, 175)')
chartColours.set('bright-purple', 'rgb(145, 43, 136)')
chartColours.set('pink', 'rgb(213, 56, 128)')
chartColours.set('light-pink', 'rgb(244, 153, 190)')
chartColours.set('orange', 'rgb(244, 119, 56)')
chartColours.set('brown', 'rgb(181, 136, 64)')
chartColours.set('light-green', 'rgb(133, 153, 75)')
chartColours.set('turquoise', 'rgb(40, 161, 151)')

chartColours.set('black', 'rgb(11, 12, 12)')
chartColours.set('dark-grey', 'rgb(80, 90, 95)')
chartColours.set('mid-grey', 'rgb(177, 180, 182)')
chartColours.set('light-grey', 'rgb(243, 242, 241)')
chartColours.set('white', 'rgb(255, 255, 255)')

const font = (props = {}) => ({
  family: '"GDS Transport", arial, sans-serif',
  weight: 'normal',
  style: 'normal',
  lineHeight: 1.2,
  ...props
})

/**
 * Provide a border radius for bar charts
 * @param {string<top|bottom>} choice
 */
const borderRadius = (choice) => {
  if (choice === 'top') {
    return {
      topLeft: 4,
      topRight: 4,
      bottomLeft: 0,
      bottomRight: 0
    }
  }

  if (choice === 'bottom') {
    return {
      topLeft: 0,
      topRight: 0,
      bottomLeft: 4,
      bottomRight: 4
    }
  }
}

export { chartColours, font, borderRadius }
