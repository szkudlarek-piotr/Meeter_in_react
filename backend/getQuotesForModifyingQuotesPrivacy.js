import dotenv from 'dotenv'
import mysql from 'mysql2'

dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function getQuotesForModyfyingQuotesPrivacy(token) {
    console.log(token)
    const reqText = `
        SELECT gq.quote_id, gq.quote, gq.is_public
        FROM sessions_data sd 
        JOIN golden_quotes gq ON sd.human_id = gq.human_id
        WHERE CURRENT_TIMESTAMP() BETWEEN login_date AND expire_date
        AND sd.session_token LIKE ?;        
    `
    const [quotesQuery] = await pool.query(reqText, [token])

    console.log(`Quotes query: ${quotesQuery}.`)
    return quotesQuery
}
