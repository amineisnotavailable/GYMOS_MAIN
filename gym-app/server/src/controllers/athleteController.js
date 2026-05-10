const athleteService = require('../services/athleteService')
const notificationService = require('../services/notificationService')

// Helper: get the athlete profile (auto-creates if missing)
const getOrCreateProfile = async (userId) => {
  return athleteService.getProfile(userId)   // our updated service already auto-creates
}

exports.getProfile = async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id)
    res.json(profile)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.updateProfile = async (req, res) => {
  // Placeholder (not needed now)
  res.json({ message: 'Update not implemented yet' })
}

exports.getMySessions = async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id)   // ensures a profile exists
    const sessions = await athleteService.getMySessions(profile.id)
    res.json(sessions)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsForUser(req.user.id)
    res.json(notifications)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.markNotificationRead = async (req, res) => {
  try {
    await notificationService.markAsRead(parseInt(req.params.id))
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.addSport = async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id)
    const { sportId } = req.body
    await athleteService.addSport(profile.id, parseInt(sportId))
    res.status(201).json({ message: 'Sport added' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}