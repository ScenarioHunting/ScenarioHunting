const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3001

app.use('/', express.static(path.join(__dirname, 'dist')))
// app.use('/default-templates', express.static(path.join(__dirname, 'dist', 'default-templates')))

app.listen(port, () => console.log("Listening on Port", port)) 