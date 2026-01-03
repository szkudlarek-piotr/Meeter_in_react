import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
export default async function addVisit(date, shortDesc, longDesc, duration) {
    const reqText = `INSERT INTO visits (visit_date, visit_duration, short_description, description, place_id) VALUES (?, ?, ?, ?, 2)`
    try {
        const [insertReq] = await pool.query(reqText, [date, duration, shortDesc, longDesc])
        return insertReq
    }
    catch(error) {
        return error
    }
}
