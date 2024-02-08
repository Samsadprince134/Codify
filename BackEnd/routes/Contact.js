const express = require("express")
const router = express.Router()

const { contactUs } = require("../controllers/Contactus")

router.post("/contactus", contactUs)

module.exports = router
