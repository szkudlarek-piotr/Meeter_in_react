import dotenv from 'dotenv'
import mysql from 'mysql2'
import createDateString from './multiuseFunctions/dateToString.js'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()


export default async function getPlaceCategories(substringValue) {
    const queryText = `SELECT DISTINCT category AS name FROM places WHERE category LIKE ?`
    try {
        const [queryResult] = await pool.query(queryText, [`%${substringValue}%`])
        return queryResult
    }
    catch (error) {
        return error
    }
}