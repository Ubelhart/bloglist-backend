const bcrypt = require('bcryptjs')
const usernameRouter = require('express').Router()
const User = require('../models/user')

usernameRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  })
  response.json(users)
})

usernameRouter.post('/', async (request, response) => {
  const { name, username, password } = request.body

  if (!username || !password) {
    return response.status(400).json({
      error: 'username and password required',
    })
  } else if (password.length < 3) {
    return response.status(400).json({
      error: 'Password must be at least 3 characters long',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usernameRouter
