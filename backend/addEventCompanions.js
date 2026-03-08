import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
export default async function addEventCompanions(eventId, humanIdsArr) {
    console.log(humanIdsArr)
    const result = {
        added: [],
        skipped: [],
        errors: []
    };

    for (const human of humanIdsArr) {
        console.log(`dodaję osobę ${JSON.stringify(human.id)} do eventu ${eventId}.`)
        try {
            await pool.execute(
                `INSERT INTO event_companion (event_id, human_id)
                 VALUES (?, ?)`,
                [eventId, human.id]
            );

            result.added.push(human.id);

        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                result.skipped.push(human.id);
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