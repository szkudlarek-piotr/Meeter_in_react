import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function checkLoginStatus(token) {
    const reqText = `
    SELECT CONCAT(pp.name, ' ', pp.surname) AS user_name
    FROM sessions_data sd
    JOIN party_people pp ON pp.ID = sd.human_id
    WHERE session_token LIKE ?
    AND expire_date > CURRENT_DATE();`
    const [isLoggedReq] = await pool.query(reqText, [token])
    if (isLoggedReq.length > 0) {
        console.log("zalogowan")
        console.log(isLoggedReq[0])
        return {status: 1, name: isLoggedReq[0]}
    }
    else {
        console.log("Nie jesteś zalogowany.")
        return {status: 0, name: ""}
    }
}