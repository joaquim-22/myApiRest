const express = require('express');
const usersCtrl = require('./routes/usersCtrl')

//Router

exports.router = (() => {
    const apiRouter = express.Router();

    //Routes
    apiRouter.route('/addUser/').post(usersCtrl.addUser);
    apiRouter.route('/updateUser/:id').put(usersCtrl.updateUser);
    apiRouter.route('/deleteUser/:id').delete(usersCtrl.deleteUser);
    apiRouter.route('/user/:id').get(usersCtrl.getUser);
    apiRouter.route('/users').get(usersCtrl.getAllUsers);


    return apiRouter;
})();