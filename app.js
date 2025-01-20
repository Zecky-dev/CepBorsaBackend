import express from 'express'
import swaggerOptions from './config/swaggerOptions.js'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

import 'dotenv/config'

const swaggerDocs = swaggerJSDoc(swaggerOptions)

const app = express()
const PORT = 3000

// Routes
import stockRoutes from './routes/stock.js'
import botRoutes from './routes/bot.js'
import currencyRoutes from './routes/currency.js'

app.get('/', (req, res) => {
    res.send('Hoş geldiniz! API dökümantasyonu için /api/docs yolunu ziyaret edebilirsiniz.')
})

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/api/stock', stockRoutes)
app.use('/api/bot', botRoutes)
app.use('/api/currency', currencyRoutes)

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