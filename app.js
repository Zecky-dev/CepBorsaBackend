const express = require('express')

const swaggerOptions = require('./config/swaggerOptions')
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDocs = swaggerJSDoc(swaggerOptions)

const app = express()
const PORT = 3000

// Routes
const stockRoutes = require('./routes/stock')

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/api/stock', stockRoutes)

// 404 for other endpoints
app.use((_, res) => {
    res.status(404).json({
        statusCode: 404,
        error: "Ulaşmaya çalıştığınız nokta bulunmuyor!"
    })
})

app.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`)
})