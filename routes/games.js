const router = require('express').Router();

const gamesController = require("../controllers/games");

router.post("/win", gamesController.win)
router.post("/lost", gamesController.lost)

module.exports = router;