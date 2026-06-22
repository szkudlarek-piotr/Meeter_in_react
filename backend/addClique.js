import dotenv from 'dotenv'
import mysql from 'mysql2'
import downloadPhotoFromLink from './downloadPhotoFromLink.js'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function addClique(name, photoLink) {
    try {
        const reqText = `INSERT INTO cliques_names ( clique_name ) VALUES (?);`;
        const [addCliqueReq] = await pool.query(reqText, [name]);
        const addedCliqueId = addCliqueReq.insertId

        downloadPhotoFromLink(photoLink, "./cliques_photos", addedCliqueId)
        return addCliqueReq

    }
    catch (error) {
        console.log(error)
        return error
    }
}