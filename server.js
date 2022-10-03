const express = require('express');
const userRouter = require('./router/user.routes').router;
const postsRouter = require('./router/posts.routes').router;
const fetch = require('node-fetch')

//Server

const server = express();

server.use(express.json())
server.use(express.urlencoded({extended: true}))

//View Enginer
server.set('view engine', 'ejs')

//Router Api
server.use('/api/', userRouter);
server.use('/api/', postsRouter);

//configure routes

server.get('/', (req, res) => {
    res.render('pages/home')
});

server.get('/allUsers', async (req, res) => {

    let response = await fetch('http://localhost:6005/api/users')
    
    const data = await response.json();

    console.log(data)

    res.render('pages/users', {datas: data})
});

server.get('/register', (req, res) => {
    res.render('pages/register')
})


server.listen(6005, () => {
    console.log('Server running(6005)')
})