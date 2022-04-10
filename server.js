const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3001

app.use('/', express.static(path.join(__dirname, 'dist')))
// app.all('*', function (req, res) {
//     res.sendFile(__dirname + 'src/app/app.html')
// })

app.listen(port, () => console.log("Listening on Port", port))