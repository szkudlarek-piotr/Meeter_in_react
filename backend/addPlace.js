import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
export default async function addPlace(name, category, lat, lon) {
    const reqText = `INSERT INTO places (place_name, category, latitude, longitude) VALUES (?, ?, ?, ?)`
    const [insertResult] = await pool.query(reqText, [name, category, lat, lon])
    return insertResult
}
