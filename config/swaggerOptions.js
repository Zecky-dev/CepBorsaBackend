const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'CepBorsa Backend API',
            version: '1.0.0',
            description: 'CepBorsa mobil uygulaması için yazılmış REST API.'
        },
        servers: [
            {
                url: 'http://localhost:3000/api'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
    },
    apis: ['./routes/*.js'],
}

module.exports = swaggerOptions


