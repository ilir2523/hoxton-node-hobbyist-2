import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info'] })

const hobbies = [
    {
        name: 'Coding',
        image: 'image.jpg',
        active: true
    },
    {
        name: 'Cooking',
        image: 'image.jpg',
        active: true
    },
    {
        name: 'Teaching',
        image: 'image.jpg',
        active: true
    },
    {
        name: 'Learning',
        image: 'image.jpg',
        active: true
    }
]

const users = [
    {
        full_name: 'Nicolas',
        photo: 'photo.jpg',
        email: 'nicolas@email.com',
        hobbies: {
            connect: [{ name: 'Coding' }, { name: 'Teaching' }]
        }
    },
    {
        full_name: 'ed',
        photo: 'photo.jpg',
        email: 'ed@email.com',
        hobbies: {
            connect: [{ name: 'Teaching' }, { name: 'Learning' }]
        }
    },
    {
        full_name: 'timi',
        photo: 'photo.jpg',
        email: 'timi@email.com',
        hobbies: {
            connect: [{ name: 'Cooking' }]
        }
    }
]

async function createStuff() {
    for (const hobby of hobbies) {
        await prisma.hobby.create({ data: hobby })
    }

    for (const user of users) {
        await prisma.user.create({ data: user })
    }
}

createStuff()