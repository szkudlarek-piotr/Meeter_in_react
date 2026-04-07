import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()

const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function logout(token) {
    const logoutQueryText = "UPDATE sessions_data SET expire_date = CURRENT_TIMESTAMP() WHERE session_token = ?"
    try {
        const [logoutQuery] = await pool.query(logoutQueryText, [token])
        console.log(logoutQuery)
        return logoutQuery
    }
    catch (error) {
        return error
    }

}
