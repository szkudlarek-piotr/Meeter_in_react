import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function getQuotesForLoggedHuman(token, quotesAuthorId) {
    const humanIdReqText = `
        SELECT human_id 
        FROM sessions_data 
        WHERE session_token = ?
        AND expire_date > CURRENT_DATE()
    `;
    const [humanIdReq] = await pool.query(humanIdReqText, [token]);
    const requestorId = humanIdReq[0]["human_id"]

    if (requestorId == 77 || requestorId == 7 || requestorId == quotesAuthorId) {
        const queryText = `
            SELECT * FROM golden_quotes
            WHERE human_id = ?
            ORDER BY quote_id DESC
        `;
        const [quotesQuery] = await pool.query(queryText, [quotesAuthorId]);
        return quotesQuery
    }
    else {
        const queryText = `
            SELECT * FROM golden_quotes
            WHERE human_id = ?
            AND is_public = 1
            ORDER BY quote_id DESC            
        `
        const [quotesQuery] = await pool.query(queryText, [quotesAuthorId]);
        return quotesQuery
    }
}