const express = require('express');
const postsCtrl = require('../controller/postsCtrl')

//Router

exports.router = (() => {
    const postsRouter = express.Router();

    //Routes

    //Posts
    postsRouter.route('/addPost/').post(postsCtrl.addPost);
    postsRouter.route('/updatePost/:id').put(postsCtrl.updatePost);
    postsRouter.route('/deletePost/:id').delete(postsCtrl.deletePost);
    postsRouter.route('/getAllPosts/').get(postsCtrl.getAllPosts);
    postsRouter.route('/getPostsUser/').get(postsCtrl.getPostsMe);
    postsRouter.route('/getPost/:id').get(postsCtrl.getPostbyId);
    postsRouter.route('/like/:id').post(postsCtrl.likePost);
    postsRouter.route('/comments/:id').post(postsCtrl.addComments);

    return postsRouter;
})();