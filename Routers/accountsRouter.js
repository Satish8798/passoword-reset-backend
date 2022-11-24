const express = require("express");
const accountsModule = require("../Modules/accountsModule")

const router = express.Router();

//router.get('/',accountsModule.home);
router.post('/create-account',accountsModule.create);
router.post('/search-account',accountsModule.search);
router.post('/reset-account',accountsModule.reset);
router.post('/check-otp',accountsModule.otpCheck);

module.exports= router;