import dotenv from 'dotenv'
import mysql from 'mysql2'
import createDateString from './multiuseFunctions/dateToString.js'
import getHumanPhotoUrl from './getHumanPhotoUrl.js'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function getVisitsForLoggedHuman(sessionToken, checkedUser) {
    const idQueryText = `
    SELECT human_id 
    FROM sessions_data
    WHERE session_token LIKE ? 
    AND expire_date > CURRENT_DATE();`
    const [idQuery] = await pool.query(idQueryText, [sessionToken])
    console.log(idQuery)
    const reqAuthorId = idQuery[0]["human_id"]
    let visitsQuery
    if (reqAuthorId === 77) {
        visitsQuery = 
            `SELECT 
                v.visit_id,
                v.visit_date AS start_date,
                v.short_description,
                v.visit_duration,
                v.description AS long_description,
                ADDDATE(v.visit_date, INTERVAL (v.visit_duration - 1) DAY) AS stop_date,
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        CONCAT(
                            '{"id":', pp.id,
                            ',"name":"', pp.name,
                            '","surname":"', pp.surname,
                            '"}'
                        )
                    ),
                    ']'
                ) AS co_guests
            FROM visit_guest vg
            JOIN visits v ON v.visit_id = vg.visit_id
            JOIN visit_guest vg2 ON v.visit_id = vg2.visit_id
            JOIN party_people pp ON pp.id = vg2.guest_id
            WHERE vg.guest_id = ?
            GROUP BY v.visit_id, v.visit_date
            ORDER BY v.visit_date DESC;`
            const [visitsData] = await pool.query(visitsQuery, [checkedUser])
            const mappedData = visitsData.map((visit) => {
                return({
                    name: visit.short_description,
                    duration: visit.visit_duration,
                    startDate: visit.start_date,
                    stopDate: visit.stop_date,
                    id: visit.visit_id,
                    co_visitors: JSON.parse(visit.co_guests)
            })
            })
            const returnedData = mappedData.map((visit) => {
                let datesString
                if (createDateString(visit.startDate) == createDateString(visit.stopDate)) {
                    datesString = createDateString(visit.startDate)
                }
                else {
                    datesString = `${createDateString(visit.startDate)} - ${createDateString(visit.stopDate)}`
                }
                return({
                    name: visit.name,
                    id: visit.id,
                    date: datesString,
                    co_visitors: visit.co_visitors.map((person) => ({
                        ...person,
                        photo: getHumanPhotoUrl(person.id)
                    }))
                })
            })
            console.log(returnedData)            
            return returnedData
    }
    else {
        visitsQuery = 
        `SELECT 
            v.visit_id,
            v.visit_date AS start_date,
            v.short_description,
            v.visit_duration,
            v.description AS long_description,
            ADDDATE(v.visit_date, INTERVAL (v.visit_duration - 1) DAY) AS stop_date,
            CONCAT(
                '[',
                GROUP_CONCAT(
                    CONCAT(
                        '{"id":', pp.id,
                        ',"name":"', pp.name,
                        '","surname":"', pp.surname,
                        '"}'
                    )
                ),
                ']'
            ) AS co_guests
        FROM sessions_data sd
        JOIN visit_guest vg ON sd.human_id = vg.guest_id
        JOIN visits v ON v.visit_id = vg.visit_id
        JOIN visit_guest vg2 ON v.visit_id = vg2.visit_id
        JOIN party_people pp ON pp.id = vg2.guest_id
        WHERE 
            sd.session_token = ?
            AND sd.expire_date > CURRENT_DATE()
            AND ? IN (SELECT guest_id FROM visit_guest WHERE visit_id = v.visit_id)
        GROUP BY v.visit_id, v.visit_date
        ORDER BY v.visit_date DESC;`

        const [visitsData] = await pool.query(visitsQuery, [sessionToken, checkedUser])
        const mappedData = visitsData.map((visit) => {
            return({
                name: visit.short_description,
                duration: visit.visit_duration,
                startDate: visit.start_date,
                stopDate: visit.stop_date,
                id: visit.visit_id,
                longDesc: visit.long_description,
                co_visitors: JSON.parse(visit.co_guests)
        })
        })
        const returnedData = mappedData.map((visit) => {
            let datesString
            if (createDateString(visit.startDate) == createDateString(visit.stopDate)) {
                datesString = createDateString(visit.startDate)
            }
            else {
                datesString = `${createDateString(visit.startDate)} - ${createDateString(visit.stopDate)}`
            }
            return({
                name: visit.name,
                id: visit.id,
                date: datesString,
                longDesc: visit.longDesc,
                co_visitors: visit.co_visitors.map((person) => ({
                    ...person,
                    photo: getHumanPhotoUrl(person.id)
                }))
            })
        })
        console.log(returnedData)
        return returnedData
    }

} 

