import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
export default async function addEventCompanions(eventId, humanIdsArr) {
    const result = {
        added: [],
        skipped: [],
        errors: []
    };

    for (const humanId of humanIdsArr) {
        console.log(`dodaję osobę ${humanId} do eventu ${eventId}.`)
        try {
            await pool.execute(
                `INSERT INTO event_companion (event_id, human_id)
                 VALUES (?, ?)`,
                [eventId, humanId]
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