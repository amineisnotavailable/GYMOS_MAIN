const router = require('express').Router()
const auth = require('../middleware/auth')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// GET /api/sports → list all sports
router.get('/', auth, async (req, res) => {
  try {
    const sports = await prisma.sport.findMany()
    res.json(sports)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router