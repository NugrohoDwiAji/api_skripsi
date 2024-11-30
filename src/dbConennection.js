import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

const testConnection = () => {
    db.connect((err) => {
        if(err) {
            console.log(err)
        } else {
            console.log('connected to database')
        }
    })
}

export {db, testConnection}