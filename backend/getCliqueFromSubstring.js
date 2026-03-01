import dotenv from 'dotenv'
import mysql from 'mysql2'


dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function getCliqueFromSubstring(substring) {
    const cliqueReqText = `SELECT id, clique_name FROM cliques_names WHERE clique_name LIKE ?`
    const [cliquesReq] = await pool.query(cliqueReqText, `%${substring}%`)
    const returnedList = cliquesReq.map((clique) => ({...clique, "photo": `http://localhost:3000/clique-photo/${clique.id}`}))
    console.log(returnedList)
    return returnedList
}