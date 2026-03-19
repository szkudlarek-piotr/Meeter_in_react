import getBasicInfoForModal from "./getBasicInfoForHumanModal.js";
import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()

const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function getHumanBasicInfoFromSessionToken(token) {
    console.log(token)
    try {
        const [rows] = await pool.query(
            "SELECT human_id FROM sessions_data WHERE session_token = ? AND expire_date > CURRENT_DATE()",
            [token]
        )

        if (rows.length === 0) {
            return { success: false, message: "Invalid or expired token" }
        }
        const humanId = rows[0].human_id
        const returnedData = await getBasicInfoForModal(humanId)
        return { success: true, data: returnedData }

    } catch (err) {
        console.log(err)
        return { success: false, message: "Server error" }
    }
}