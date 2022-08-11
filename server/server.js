import express from 'express'
const app = express()
import { StreamChat } from 'stream-chat'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import cors from 'cors'

dotenv.config({ path: '../frontend/.env' })
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
)
app.use(express.json())

const api_key = process.env.REACT_APP_KEY
const api_secret = process.env.REACT_APP_SECRET
const serverClient = StreamChat.getInstance(api_key, api_secret)

app.post('/signup', async (req, res) => {
  try {
    const userId = uuidv4()
    const { firstName, lastName, username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const token = serverClient.createToken(userId)
    console.log({
      token,
      userId,
      firstName,
      lastName,
      username,
      hashedPassword,
    })
    res.json({ token, userId, firstName, lastName, username, hashedPassword })
  } catch (error) {
    res.json(error)
  }
})

app.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body
    const { users } = await serverClient.queryUsers({ name: userName })
    if (users.length === 0) return res.json({ message: 'User not found' })

    const token = serverClient.createToken(users[0].id)
    const passwordMatch = await bcrypt.compare(
      password,
      users[0].hashedPassword
    )

    if (passwordMatch) {
      res.json({
        token,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        userName,
        userId: users[0].id,
      })
    }
  } catch (error) {
    res.json(error)
  }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})

// const io = require('socket.io')(3000)

// io.on('connection', socket => {
//   console.log(socket.id)
// })
