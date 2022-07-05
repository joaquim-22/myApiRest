const express = require('express');
const usersCtrl = require('./routes/usersCtrl')

//Router

exports.router = (() => {
    const apiRouter = express.Router();

    //Routes
    apiRouter.route('/addUser/').post(usersCtrl.addUser);
    apiRouter.route('/updateUser/').put(usersCtrl.updateUser);
    apiRouter.route('/deleteUser/').delete(usersCtrl.deleteUser);
    apiRouter.route('/user/').get(usersCtrl.getUser);
    apiRouter.route('/users/').get(usersCtrl.getAllUsers);
    apiRouter.route('/login/').post(usersCtrl.login)


    return apiRouter;
})();