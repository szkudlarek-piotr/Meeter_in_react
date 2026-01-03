import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
export default async function getPlaceFromSubstring(deliveredSubstring){
    let returnedArray = []
    const queryText = `
    SELECT id, place_name, category 
    FROM places
    WHERE place_name LIKE ?`
    if (deliveredSubstring.length > 2) {
        const [placesList] = await pool.query(queryText, `%${deliveredSubstring}%`)
        returnedArray = placesList
    }
    console.log(returnedArray)
    return returnedArray


}
