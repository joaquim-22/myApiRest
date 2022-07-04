const express = require('express');
const usersCtrl = require('./routes/usersCtrl')

//Router

exports.router = (() => {
    const apiRouter = express.Router();

    //Routes
    apiRouter.route('/users').post(usersCtrl.addUser)


    return apiRouter;
})();