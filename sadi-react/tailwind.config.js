/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        '8': 'repeat(8, minmax(0, 1fr))',
        '9': 'repeat(9, minmax(0, 1fr))',
        '10': 'repeat(10, minmax(0, 1fr))',
        '11': 'repeat(11, minmax(0, 1fr))',
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gridRowEnd: {
        '8': '8',
        '9': '9',
        '10': '10',
        '11': '11',
        '12': '12',
      },
      width: {
        'fill': '-webkit-fill-available',
      },
      height: {
        'fill': '-webkit-fill-available',
      },
      minHeight: {
        'fill': '-webkit-fill-available',
      },
      maxHeight: {
        'fill': '-webkit-fill-available',
      },
      minWidth: {
        'fill': '-webkit-fill-available',
      },
      maxWidth: {
        'fill': '-webkit-fill-available',
      },
      
    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
