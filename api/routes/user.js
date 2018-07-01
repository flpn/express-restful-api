const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/user')

const router = express.Router()

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(users => {
            if(users.length != 0){
                return res.status(409).json({ message: 'Email already is registered' })
            }

            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({ message:'erro depois do hash', error: err })
                }
                else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
        
                    user.save()
                        .then(newUser => {
                            res.status(201).json({ message: `User ${newUser.email} created!` })
                        })
                }
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })            
        })
})

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({ message: `User ${req.params.userId} deleted!` })
        })
        .catch(err => {
            res.status(500).json({ error: err })            
        })
})

module.exports = router