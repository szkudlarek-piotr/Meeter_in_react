import dotenv from 'dotenv'
import mysql from 'mysql2'

dotenv.config()
const pool = mysql.createPool({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function changeQuotePrivacyFromTokenAndId(token, quoteIq, targetPrivacy) {
    const reqText = `
        UPDATE golden_quotes 
        SET is_public = ?
        WHERE quote_id = ?
        AND quote_id IN 
        (SELECT gq.quote_id 
        FROM golden_quotes gq
        JOIN sessions_data sd ON gq.human_id = sd.human_id
        WHERE CURRENT_TIMESTAMP() BETWEEN sd.login_date AND sd.expire_date
        AND sd.session_token = ?);
    `
    /*console.log(
        reqText,
        [targetPrivacy, quoteIq, token]
    );*/
    try {
        const [reqQuery] = await pool.query(reqText, [targetPrivacy, quoteIq, token]);
        //console.log(reqQuery)
        return reqQuery;
    }
    catch(error) {
        console.log(error)
        return error;
    }


}