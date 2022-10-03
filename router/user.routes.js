const express = require('express');
const usersCtrl = require('../controller/usersCtrl')

//Router

exports.router = (() => {
    const userRouter = express.Router();

    //Routes

    //User
    userRouter.route('/addUser/').post(usersCtrl.addUser);
    userRouter.route('/updateUser/').put(usersCtrl.updateUser);
    userRouter.route('/deleteUser/').delete(usersCtrl.deleteUser);
    userRouter.route('/user/me').get(usersCtrl.getUserMe);
    userRouter.route('/user/:id').get(usersCtrl.getUser);
    userRouter.route('/users/').get(usersCtrl.getAllUsers);
    userRouter.route('/login/').post(usersCtrl.login);

    return userRouter;
})();