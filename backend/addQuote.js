import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function addQuote(authorId, quote, isPublic) {
    const reqText = `INSERT INTO golden_quotes (human_id, quote, is_public) VALUE (?, ?, ?)`
    try {
        const [insertReq] = await pool.query(reqText, [authorId, quote, isPublic])
        return insertReq
    }
    catch (error) {
        return error
    }
}