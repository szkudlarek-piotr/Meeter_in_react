import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
export default async function addHumansToMeeting(meetingId, humanIds){
    const insertQuery =
        "INSERT INTO meeting_human (meeting_id, human_id) VALUES ?";
    const values = humanIds.map(humanId => [meetingId, humanId]);
    const [result] = await pool.query(insertQuery, [values]);
    return result
}
