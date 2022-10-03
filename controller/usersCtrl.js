const asyncLib = require('async');
const models = require('../models');
const bcrypt = require('bcrypt');
const jwtUtils = require('../jwtUtils')
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,10}$/

module.exports = {

    addUser: (req, res) => {

        let lastName = req.body.lastName;
        let firstName = req.body.firstName;
        let email = req.body.email;
        let password = req.body.password;
        let role = req.body.role;

        if (email == null || lastName == null || firstName == null || password == null) {
            return res.status(400).json({'error': 'Parametres manquantes'})
        }

        if(!EMAIL_REGEX.test(email)) {
            return res.status(400).json({'error': 'Email not valid'})
        }

        if(!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({'error': 'Password not valid'})
        }

        //Verify if user exists

        asyncLib.waterfall([
            (done) => {
                //Search if user email already exists
                models.User.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                .then((userFound) => {
                    done(null, userFound)
                })
                .catch((err) => {
                    return res.status(409).json({'error': 'An error occurred'})
                })
            },
            (userFound, done) => {
                //If user not exists, we hash password and passing for next function
                if(!userFound) {
                    bcrypt.hash(password, 5, (err, bcryptedPassword) => {
                        done(null, userFound, bcryptedPassword)
                    })
                }
                else {
                    return res.status(409).json({'error': 'User Already exists'})
                }
            },
            (userFound, bcryptedPassword, done) => {
                //Creating user with hash password and with the data that we declare with variables 
                let newUser = models.User.create({
                    lastName: lastName,
                    firstName: firstName,
                    email: email,
                    password: bcryptedPassword,
                    role: 0
                })
                //If user created with success we avance for next function
                .then((newUser) => {
                    done(newUser)
                })
                .catch((err) => {
                    return res.status(400).json({'error': 'An error occurred'})
                })
            }
        ], (newUser) => {
            //Handling errors
            if(newUser){
                return res.status(201).json({'success': 'user successfuly created'})
            }
            else {
                return res.status(400).json({ 'error': 'An error occurred'})
            }
        })
    },

    updateUser: (req, res) => {
        //Using token for having data of the actual user without another login
        let headerAuth  = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        let lastName = req.body.lastName;
        let firstName = req.body.firstName;
        let role = req.body.role;

        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                    attributes: ['id', 'lastName', 'firstName', 'email', 'role'],
                    where: { id: userId }
                })
                .then((userFound) => {
                    done(null, userFound);
                })
                .catch((err) => {
                    return res.status(400).json({ 'error': 'Unable to verify user' });
                });
            },
            (userFound, done) => {
              if(userFound) {
                //Updating all data even the older that the user don't change
                userFound.update({
                    lastName: (lastName ? lastName : userFound.lastName),
                    firstName: (firstName ? firstName : userFound.firstName),
                    role: (role ? role : userFound.role)
                })
                .then((userFound) => {
                    done(userFound);
                })
                .catch((err) => {
                    res.status(400).json({ 'error': 'An error occurred' });
                });
              }
              else {
                res.status(404).json({ 'error': 'An error occurred' });
              }
            },
          ], 
          (userFound) => {
            //Hanfling errors
            if (userFound) {
                res.status(200).json({'success': 'User successfuly modified'})
            } 
            else {
              return res.status(400).json({ 'error': 'An error occurred' });
            }
          });
    },

    deleteUser: (req, res) => {
        let headerAuth  = req.headers['authorization'];
        let userId      = jwtUtils.getUserId(headerAuth);

        asyncLib.waterfall([
            (done) => {
                models.User.destroy({
                    where: { id: userId }
                })
                .then((userFound) => {
                    done(userFound)
                })
                .catch((err) => {
                    return res.status(400).json({ 'error': 'An error occurred' });
                });
            }],
            (userFound) => {
                if (userFound) {
                    return res.status(200).json({'success':`User successfuly deleted`})
                }
                else {
                    return res.status(404).json({ 'error': 'User was not found' });
                }
            });
    },

    getUserMe: (req, res) => {
        let headerAuth = req.headers['authorization']
        let userId = jwtUtils.getUserId(headerAuth)
    
        if(userId < 0) {
          return res.status(400).json({'error':'An error occured mauvais token'})
        }
    
        models.User.findOne({
            attributes: [ 'id', 'firstName', 'lastName', 'email', 'role' ],
            where: { id: userId }
          })
          .then((user) => {
            if (user) {
              res.status(201).json(user);
            }
            else {
              res.status(404).json({ 'error': 'user not found' });
            }
          })
          .catch((err) => {
            res.status(500).json({ 'error': 'cannot fetch user' });
          });
      },

      getUser: (req, res) => {
        let userId = req.params.id
        
        //Getting users by the id gaved on url
        models.User.findOne({
            attributes: [ 'id', 'firstName', 'lastName', 'email', 'role' ],
            where: { id: userId }
          })
          .then((user) => {
            if (user) {
              res.status(201).json(user);
            }
            else {
              res.status(404).json({ 'error': 'User not found' });
            }
          })
          .catch((err) => {
            res.status(500).json({ 'error': 'Cannot fetch user' });
          });
      },  

    getAllUsers: (req, res) => {
        models.User.findAll({
            attributes: [ 'id', 'lastName', 'firstName', 'email', 'role' ]
        })
        .then((users) => {
            res.status(200).json(users)
        })
        .catch((err) => {
            res.status(400).json({ 'error': 'An error occurred' });
        });
    },

    login: (req, res) => {
    
        // Params
        var email    = req.body.email;
        var password = req.body.password;
    
        if (email == null ||  password == null) {
          return res.status(400).json({ 'error': 'missing parameters' });
        }
    
        asyncLib.waterfall([
          (done) => {
            models.User.findOne({
                where: { email: email }
            })
            .then((userFound) => {
                done(null, userFound);
            })
            .catch((err) => {
                return res.status(500).json({ 'error': 'unable to verify user' });
            });
          },
          (userFound, done) => {
            if (userFound) {
              //Compare for checking if the user had put the goood password
              bcrypt.compare(password, userFound.password, (errBycrypt, resBycrypt) => {
                done(null, userFound, resBycrypt);
              });
            } 
            else {
              return res.status(404).json({ 'error': 'user not exist in DB' });
            }
          },
          (userFound, resBycrypt, done) => {
            if(resBycrypt) {
              done(userFound);
            } 
            else {
              return res.status(403).json({ 'error': 'invalid password' });
            }
          }
        ], 
        (userFound) => {
          if (userFound) {
            return res.status(201).json({
              'id': userFound.id,
              //Generating token for user logged in
              'token': jwtUtils.generateTokenForUser(userFound)
            });
          } 
          else {
            return res.status(500).json({ 'error': 'cannot log on user' });
          }
        });
      }
}