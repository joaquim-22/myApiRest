const express = require('express');
const apiRouter = require('./apiRouter').router;

//Server

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json())

//configure routes

server.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send('<h1>Bonjour server</h1>')    
});


//Router Api
server.use('/api/', apiRouter);

server.listen(5000, () => {
    console.log('Server running')
})