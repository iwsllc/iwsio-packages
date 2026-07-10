/* eslint-disable @typescript-eslint/no-require-imports */

const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))

const expectedData = [
	{
		title: 'The Matrix',
		year: 1999,
		director: 'The Wachowski Brothers',
		cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss', 'Hugo Weaving'],
		genres: ['Action', 'Sci-Fi'],
		rating: 8.7
	}
]

app.get('/test', (_req, res) => {
	res.send('Hello World')
})
app.get('/test-json', (_req, res) => {
	res.json(expectedData)
})
app.get('/test-500', (_req, res) => {
	res.status(500).send('Internal Server Error')
})
app.get('/test-500-json', (_req, res) => {
	res.status(500).json({ message: 'Fake error', stack: 'Fake stack trace' })
})

app.listen(3000, (..._args) => {
	console.log('Listening on port 3000')
})
