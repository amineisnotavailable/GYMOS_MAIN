const router = require('express').Router()
const auth = require('../middleware/auth')
const role = require('../middleware/roleCheck')
const coachCtrl = require('../controllers/coachController')
const coachApproved = require('../middleware/coachApproved');

router.use(auth, role('COACH'))
router.use(auth, role('COACH'), coachApproved);

router.get('/athletes', coachCtrl.getMyAthletes)          // assigned athletes only
router.get('/all-athletes', coachCtrl.getAllAthletes)     // all athletes in DB
router.post('/assign-athlete', coachCtrl.assignAthlete)   // assign an athlete to me
router.get('/schedule', coachCtrl.getSchedule)
router.post('/sessions', coachCtrl.createSession)
router.post('/remind', coachCtrl.sendReminder)
router.post('/notifications', coachCtrl.sendNotification);
router.get('/users', coachCtrl.getUsers);
router.put('/athletes/:id/level', coachCtrl.updateAthleteLevel);


// Notifications (shared controller)
const notifCtrl = require('../controllers/athleteController')
router.get('/notifications', notifCtrl.getNotifications)
router.put('/notifications/:id/read', notifCtrl.markNotificationRead)

module.exports = router