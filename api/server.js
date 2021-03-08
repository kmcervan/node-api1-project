// BUILD YOUR SERVER HERE

// importing express from 'express'
const express = require('express')

//importing models here
const Users = require('./users/model')

// changing express() name to server
const server = express()

//adding a global middleware
server.use(express.json()) //teaches express to parse the bodies of reqs as JSON

// endpoints will go here

// [GET] - R (return) of CRUD, fetches an array of all users
server.get('/api/users', (req, res) => {
    Users.find()
    .then(user => {
        console.log(user)
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json({ message: "The users information could not be retrieved" })
    })
})

// [GET] - R (return) of CRUD, fetches a user by id
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    Users.findById(id)
    .then(user => {
        console.log('we are fetching -->', user)
        if (!user){
            res.status(404).json({ message: "The user with the specified ID does not exist"})
        }else{
            res.json(user)
        }
    })
    .catch(err => {
        res.status(500).json({ message: "The user information could not be retrieved" })
    })
})

// [POST] - C (create) of CRUD, create a new user
server.post('/api/users', (req, res) => {
    const newUser = req.body

    if(!newUser.name || !newUser.bio){
        res.status(400).json({ message: "Please provide name and bio for the user" })
    }else{
        Users.insert(newUser)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err =>{
            res.status(500).json({message: "There was an error while saving the user to the database"})
        })
    }
})

// [PUT] - U (update) of CRUD, updates user with specific id
server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params
    const changes = req.body

    try{
        if(!changes.name || !changes.bio){
            res.status(400).json({ message: "Please provide name and bio for the user"})
        } else{
            const updatedUser = await Users.update(id, changes)
            if(!updatedUser){
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            }else{
                res.json(updatedUser)
            }
        }
    }catch(err){
        res.status(500).json({message: "The user information could not be modified"})
    }
})

// [DELETE] - D (delete) of CRUD, this will delete a user with specific id
server.delete('/api/users/:id', async (req, res) => {
    try {
        const deleted = await Users.remove(req.params.id)
        if(!deleted){
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }else{
            res.json(deleted)
        }
    }catch(err){
        res.status(500).json({message: "The user could not be removed"})
    }
})

// universal [GET], this will respond to all request that can't be found
server.use('*', (req, res) => {
    res.status(404).json({ message: 'sorry we cannot find what you are looking for'})
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
