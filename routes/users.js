const router = require('express').Router();

const usersController = require("../controllers/users");

router.get("/", usersController.getUsers)
router.get("/me", usersController.getMe)
router.put("/me", usersController.updateMe)
router.delete("/me", usersController.deleteMe)
router.put("/me/reset-stats", usersController.resetStats)

module.exports = router;