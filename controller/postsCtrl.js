const asyncLib = require("async");
const jwtUtils = require("../jwtUtils");
const models = require("../models");

module.exports = {
  
  addPost: (req, res) => {
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);

    let content = req.body.content;

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            where: { id: userId },
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch((err) => {
              console.log(err);
              return res.status(400).json({ error: "An error occurred" });
            });
        },
        (userFound, done) => {
          //Updating all data even the older that the user don't change
          if (userFound) {
            let newPost = models.Posts.create({
              content: content,
              userId: userFound.id,
            })
              .then((newPost) => {
                done(newPost);
              })
              .catch((err) => {
                console.log(err);
                res.status(400).json({ error: "An error occurred" });
              });
          } else {
            res.status(404).json({ error: "An error occurred" });
          }
        },
      ],
      (newPost) => {
        //Handling errors
        if (newPost) {
          return res.status(201).json({ success: "post successfuly created" });
        } else {
          return res.status(400).json({ error: "An error occurred" });
        }
      }
    );
  },

  updatePost: (req, res) => {
    //Using token for having data of the actual user without another login
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);
    let postId = req.params.id;

    let content = req.body.content;

    asyncLib.waterfall(
      [
        (done) => {
          models.Posts.findOne({
            attributes: ["id", "userId", "content"],
            where: { id: postId, userId: userId },
          })
            .then((postFound) => {
              done(null, postFound);
            })
            .catch((err) => {
              return res.status(400).json({ error: "Unable to verify post" });
            });
        },
        (postFound, done) => {
          if (postFound) {
            //Updating all data even the older that the user don't change
            postFound
              .update({
                content: content ? content : postFound.content,
              })
              .then((postFound) => {
                done(postFound);
              })
              .catch((err) => {
                res.status(400).json({ error: "An error occurred" });
              });
          } else {
            res.status(404).json({ error: "An error occurred" });
          }
        },
      ],
      (postFound) => {
        //Hanfling errors
        if (postFound) {
          res.status(200).json({ success: "Post successfuly modified" });
        } else {
          return res.status(400).json({ error: "An error occurred" });
        }
      }
    );
  },

  deletePost: (req, res) => {
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);

    let postId = req.params.id;

    asyncLib.waterfall(
      [
        (done) => {
          models.Posts.destroy({
            where: { userId: userId, id: postId },
          })
            .then((postFound) => {
              done(postFound);
            })
            .catch((err) => {
              return res.status(400).json({ error: "An error occurred" });
            });
        },
      ],
      (postFound) => {
        if (postFound) {
          return res.status(200).json({ success: `Post successfuly deleted` });
        } else {
          return res.status(404).json({ error: "Post was not found" });
        }
      }
    );
  },

  getAllPosts: (req, res) => {
    models.Posts.findAll({
      attributes: ["id", "userId", "content"],
    })
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((err) => {
        res.status(400).json({ error: "An error occurred" });
      });
  },

  getPostsMe: (req, res) => {
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);

    models.Posts.findAll({
      attributes: ["id", "userId", "content", "createdAt"],
      where: { id: userId },
    })
      .then((posts) => {
        if (posts) {
          res.status(201).json(posts);
        } else {
          res.status(404).json({ error: "user not found" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: "cannot fetch user" });
      });
  },

  getPostbyId: (req, res) => {
    let postId = req.params.id;

    //Getting users by the id gaved on url
    models.Posts.findOne({
      attributes: ["id", "userId", "content", "createdAt"],
      where: { id: postId },
    })
      .then((post) => {
        if (post) {
          res.status(201).json(post);
        } else {
          res.status(404).json({ error: "User not found" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: "Cannot fetch user" });
      });
  },

  likePost: (req, res) => {
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);
    let postId = req.params.id;

    models.Likes.findOne({
      where: {userId: userId,
        postId: postId,}
    })
      .then((like) => {
        if (!like) {
          models.Likes.create({
            userId: userId,
            postId: postId,
            like: 1
          })
            .then((like) => {
                res.status(201).json(like);
            })
            .catch((err) => {
              console.log(err)
              res.status(500).json({ error: "Cannot like post" });
            });
        } else {
          models.Likes.destroy({
            where: { userId: userId, postId: postId },
          })
            .then((like) => {
                res.status(201).json({
                  like,
                  "msg":`success deleted`
                });

            })
            .catch((err) => {
              res.status(500).json({ error: "Cannot delete like" });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: "Cannot fetch like" });
      });
  },

  addComments: (req, res) => {
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);
    let postId = req.params.id;
    let content = req.body.content;

    models.Comments.create({
        content: content,
        userId: userId,
        postId: postId
    })
    .then((comment) => {
      return res.status(200).json(comment)  
    })
    .catch((err) => {
        return res.status(400).json({ error: "Cannot comment" })
    })
  }
};
