import dotenv from 'dotenv'
import mysql from 'mysql2'


dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function getDancingVideos(){
    const queryText = "SELECT id, title, long_desc, date, link FROM videos WHERE is_dancing_lesson_video ORDER BY date DESC";
    try {
        const [query] = await pool.query(queryText);
        const mappedVideos = query.map((video) => ({
            ...video,
            "link": video.link.split("/").pop()
        }))
        return mappedVideos
    }
    catch (error) {
        return error
    }


}