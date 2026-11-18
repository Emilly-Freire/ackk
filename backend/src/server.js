const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const router = require('../src/routes/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');


app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(router);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
