var pio = require('../index')({
	debug: true,
	path: '/Users/j.hollmann/Projects/lasertag-project/sender'
});

pio.compile({
	env: 'arduino_uno'
});