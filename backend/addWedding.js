import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function addWedding(date, groomId, brideId, infoAfterHover, partnerId, wedding_place_id, party_place_id, hotel_id, afterpaty, description, was_i_invited) {
    const queryText = "INSERT INTO `weddings` (`date`, `man_id`, `woman_id`, `info_after_hover`, `partner_id`, `wedding_place_id`, `party_place_id`, `hotel_id`, `poprawiny`, `description`, `was_i_invited`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
    try {
        const [insertReq] = await pool.query(queryText, [date, groomId, brideId, infoAfterHover, partnerId, wedding_place_id, party_place_id, hotel_id, afterpaty, description, was_i_invited])
        return insertReq
    }
    catch (error) {
        return error
    }

}
