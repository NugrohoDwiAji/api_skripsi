import express from 'express'
const router = express.Router()

import registerRouter from './register.js'
import loginRouter from './login.js'

router.use('/register',registerRouter)
router.use('/login',loginRouter)


router.use("*",(req, res)=>{
    res.status(404).send("Not Found")
})

export default router;