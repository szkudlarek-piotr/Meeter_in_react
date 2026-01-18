import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
export default async function addMeeting(date, shortDesc, longDesc, placeText, placeId){
    if (placeId.length > 0) {
        try {
            const addMeetingText = "INSERT INTO `meetings` (`ID`, `short_description`, `meeting_date`, `Place`, `long_desc`, `place_id`) VALUES (NULL, ?, ?, ?, ?, ?);"
            const [addReq] = await pool.query(addMeetingText, [shortDesc, date, placeText, longDesc, placeId])
            return addReq
        }
        catch (error) {
            return error
        }
    }
    else {
        try {
            const addMeetingText = "INSERT INTO `meetings` (`ID`, `short_description`, `meeting_date`, `Place`, `long_desc`) VALUES (NULL, ?, ?, ?, ?);"
            const [addReq] = await pool.query(addMeetingText, [shortDesc, date, placeText, longDesc, placeId])
            return addReq
        }
        catch (error) {
            return error
        }
    }
}