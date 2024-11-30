import express from 'express'
const registerRouter = express.Router()

import { register, registerAffineCipher,  registerHybrid} from '../controllers/registerControllers.js'



registerRouter
.route("/")
.post(register)
registerRouter
.route("/affineCipher")
.post(registerAffineCipher)
registerRouter
.route("/hybrid")
.post(registerHybrid)


export default registerRouter