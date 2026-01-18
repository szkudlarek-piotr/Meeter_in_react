import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
export default async function addVisitingHuman(visitId, humanIdsArr) {
    const result = {
        added: [],
        skipped: [],
        errors: []
    };

    for (const humanId of humanIdsArr) {
        try {
            await pool.execute(
                `INSERT INTO visit_guest (visit_id, guest_id)
                 VALUES (?, ?)`,
                [visitId, humanId]
            );

            result.added.push(humanId);

        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                result.skipped.push(humanId);
            } else {
                result.errors.push({
                    humanId,
                    reason: err.code
                });
            }
        }
    }
    console.log(result)

    return result;
}