const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const userRoutes = require('./routes/user_routes');
const statusRoutes = require('./routes/status_routes');
require('dotenv').config();
// const https = require('https');
// const fs = require('fs');
const app = express();
const db = require('./models/index');

// API Documentation
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'E-connect Project',
            description: 'E-connect Project Application API',
            contact: {
                name: 'Karthik A',
            },
            servers: ['http://localhost:8080'],
        },

    },
    apis: ['./routes/**.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Application configurations
const PORT = 8080 || process.env.PORT;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Application Routing
app.use('/user', userRoutes);
app.use('/status', statusRoutes);
app.use('/', (req, res) => {
    res.send({ message: 'Welcome to E-con server ' });
})
app.use("*", (req, res,) => {
    return res.status(404).json({
        success: false,
        message: 'API_ENDPOINT_NOT_FOUND'
    })
});


db.sequelize.sync({ force: true }).then(() => {
    console.log('DB Synced')
}).catch((err) => {
    console.log('Failed to Sync DB : ', err.message)
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})

// https.createServer(options, app).listen(PORT, () => {
//     console.log(`server running on port ${PORT}`)
// });