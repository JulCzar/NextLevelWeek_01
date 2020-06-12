const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const path = require('path')
const { errors } = require('celebrate')

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(errors())

app.listen(4000)