import express from 'express'
const loginRouter = express.Router()

import {  login } from '../controllers/loginController.js'

loginRouter
.route("/")
.post(login)   

export default loginRouter