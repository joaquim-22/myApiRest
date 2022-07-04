const express = require('express');
const usersCtrl = require('./routes/usersCtrl')

//Router

exports.router = (() => {
    const apiRouter = express.Router();

    //Routes
    apiRouter.route('/addUser/').post(usersCtrl.addUser)
    apiRouter.route('/updateUser/:id').put(usersCtrl.updateUser)


    return apiRouter;
})();