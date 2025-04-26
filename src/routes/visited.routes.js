const express = require("express");
const router = express.Router();
const controller = require("../controllers/visited.controller");

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findByLandmarkId);

module.exports = router;
