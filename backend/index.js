const express = require('express');
const app = express();
const cors = require('cors');
const grid = require('./controllers/gridController');
const register = require('./controllers/palavraController');

app.use(cors());
app.use(express.json());


app.use('/grid', grid);
app.use('/palavra', register);



app.listen(3001, () => {
    console.log('.........server running on 3001........');
})