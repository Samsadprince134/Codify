const express = require("express")
const router = express.Router()
const cors = require("cors");
router.use(cors({
  origin: 'https://codify-frontend-one.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const { contactUs } = require("../controllers/Contactus")

router.post("/contactus", contactUs)

module.exports = router
