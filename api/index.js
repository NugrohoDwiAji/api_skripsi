import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import router from '../src/routes/index.js'  
import { testConnection } from '../src/dbConennection.js'
const app = express()
const port = 3001
dotenv.config()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

testConnection()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(router)

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
 

export default app