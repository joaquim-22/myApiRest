const asyncLib = require('async');
const models = require('../models');
const bcrypt = require('bcrypt');
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

        //Verifier si le user exist sinon créer un user

        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                .then((userFound) => {
                    done(null, userFound)
                })
                .catch((err) => {
                    return res.status(500).json({'error': 'Impossible to verify user'})
                })
            },
            (userFound, done) => {
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
                let newUser = models.User.create({
                    lastName: lastName,
                    firstName: firstName,
                    email: email,
                    password: bcryptedPassword,
                    role: 0
                })
                .then((newUser) => {
                    done(newUser)
                })
                .catch((err) => {
                    return res.status(500).json({'error': 'cannot add user'})
                })
            },
            (newUser) => {
                if(newUser){
                    return res.status(201).json({'success': 'user successfuly created'})
                }
                else {
                    return res.status(500).json({ 'error': 'cannot add user'})
                }
            }
        ], (newUser) => {
            if(newUser){
                return res.status(201).json({'success': 'user successfuly created'})
            }
            else {
                return res.status(500).json({ 'error': 'cannot add user'})
            }
        })

        
    }
}