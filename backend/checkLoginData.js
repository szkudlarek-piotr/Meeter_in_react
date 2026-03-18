import dotenv from 'dotenv'
import mysql from 'mysql2'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

dotenv.config()
const pool = mysql.createPool({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function checkPassword(username, password) {
    console.log(username, password)
    try {
        const [userDataReq] = await pool.query(
            "SELECT human_id, passwordHash FROM login_data WHERE username = ?", 
            [username]
        )

        if (userDataReq.length === 0) {
            console.log("Nieprawidłowy login lub hasło")
            return { success: false, message: "Nieprawidłowy login lub hasło." }
        }

        const hashedPassword = userDataReq[0]["passwordHash"]
        const userId = userDataReq[0]["human_id"]
        const checkResult = await bcrypt.compare(password, hashedPassword)

        if (!checkResult) {
            console.log("Nieprawidłowy login lub hasło")
            return { success: false, message: "Nieprawidłowy login lub hasło." }
        }


        const token = randomBytes(32).toString('hex')
        const thirtyDays =  60 * 60 * 1000
        const expireDate = new Date(Date.now() + thirtyDays)


        await pool.query(
            "INSERT INTO sessions_data (session_token, human_id, expire_date) VALUES (?, ?, ?)",
            [token, userId, expireDate]
        )
        console.log("Podałeś prawidłowe dane!")
        return {
            success: true,
            data: {
                token,
                expireDate,
                userId
            }
        }

    } catch (err) {
        console.error("Błąd checkPassword:", err)
        return { success: false, message: "Wystąpił błąd serwera." }
    }
}

