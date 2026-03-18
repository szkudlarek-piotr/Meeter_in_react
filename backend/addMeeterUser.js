import dotenv from 'dotenv'
import mysql from 'mysql2'
import bcrypt from 'bcrypt'

dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function addMeeterUser(username, password, email) {
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)
    const [insertReq] = await pool.query("INSERT INTO login_data (username, email, passwordHash) VALUES (?, ?, ?)", [username, email, hashedPassword])
    console.log(insertReq)

}
