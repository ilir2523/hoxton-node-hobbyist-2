import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import e from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4001

const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info'] })

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({ include: { hobbies: true } })
  res.send(users)
})

app.get('/users/:id', async (req, res) => {
  const id = Number(req.params.id)
  const users = await prisma.user.findUnique({ where: { id: id }, include: { hobbies: true } })
  res.send(users)
})

app.get('/hobbies', async (req, res) => {
  const hobbies = await prisma.hobby.findMany({ include: { users: true } })
  res.send(hobbies)
})

app.get('/hobbies/:id', async (req, res) => {
  const id = Number(req.params.id)
  const hobbies = await prisma.hobby.findUnique({ where: { id: id }, include: { users: true } })
  res.send(hobbies)
})

app.post('/users', async (req, res) => {
  const { full_name, photo, email, hobbies = [] } = req.body

  try {
    const newUser = await prisma.user.create({
      data: {
        full_name,
        photo,
        email,
        hobbies: {
          // an array of {where, create} data for hobbies
          connectOrCreate: hobbies.map((hobby: any) => ({
            // try to find the hobby if it exists
            where: { name: hobby.name },
            // if it doesn't exist, create a new hobby
            create: hobby
          }))
        }
      },
      include: {
        hobbies: true
      }
    })
    res.send(newUser)
  } catch (err) {
    // @ts-ignore
    res.status(400).send(`<pre>${err.message}</pre>`)
  }
})

app.post('/addHobby', async (req, res) => {
  const { email, hobby } = req.body

  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: {
        hobbies: {
          connectOrCreate: {
            where: { name: hobby.name },
            create: hobby
          }
        }
      },
      include: {
        hobbies: true
      }
    })
    res.send(user)
  } catch (err) {
    // @ts-ignore
    res.status(400).send(`<pre>${err.message}</pre>`)
  }
})

app.patch('/removeHobbyFromUser', async (req, res) => {
  const { userId, hobbyId } = req.body

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { hobbies: { disconnect: { id: hobbyId } } },
      include: { hobbies: true }
    })

    res.send(updatedUser)
  } catch (err) {
    // @ts-ignore
    res.status(400).send(`<pre>${err.message}</pre>`)
  }
})


app.listen(PORT, () => {
  console.log(`Server runing on: http://localhost:${PORT}/`)
})