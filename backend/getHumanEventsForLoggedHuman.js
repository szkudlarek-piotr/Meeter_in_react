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

export default async function getHumanEventsForLoggedHuman(token, checkedHuman) {
    const askingHumanIdReqText = `
        SELECT human_id 
        FROM sessions_data 
        WHERE session_token = ?
        AND expire_date > CURRENT_TIMESTAMP()
    `
    let mappedEvents = []
    const [askingHumanIdReq] = await pool.query(askingHumanIdReqText, [token])
    const requestorId = askingHumanIdReq[0]["human_id"]
    if (requestorId == 7 || requestorId == 77 || requestorId == checkedHuman) {
        const reqText = `
            SELECT e.id, e.nameOfEvent, e.meComingDate, e.meLeavingDate, e.place, e.description,
            CONCAT('[', GROUP_CONCAT(JSON_OBJECT('id', pp.ID, 'full_name', CONCAT(pp.name, ' ', pp.surname))), ']') AS people_json
            FROM events e
            JOIN event_companion ec ON ec.event_id = e.id
            JOIN party_people pp ON pp.ID = ec.human_id
            WHERE e.id IN (
                SELECT event_companion.event_id
                FROM event_companion
                WHERE event_companion.human_id = ?
            )
            GROUP BY e.id, e.nameOfEvent, e.meComingDate, e.meLeavingDate, e.place, e.description
            ORDER BY meComingDate DESC;
        `
        const [eventReq] = await pool.query(reqText, [checkedHuman])

        mappedEvents = eventReq.map(event => {
            try {
                const people = JSON.parse(event.people_json)
                const eventStartDateString = createDateString(event.meComingDate)
                const eventStopDateString = createDateString(event.meLeavingDate)
                let datesString;
                if (eventStartDateString != eventStopDateString) {
                    datesString = `${eventStartDateString} - ${eventStopDateString}`
                }
                else {
                    datesString = eventStartDateString
                }
                console.log(datesString)
                return {
                    "id": event.id,
                    "datesString": datesString,
                    "shortName": event.nameOfEvent,
                    "longDesc": event.description,
                    "place": event.place,
                    "people_json": people.map((human) => ({
                        ...human,
                        "photo": getHumanPhotoUrl(parseInt(human.id))
                    }))
                }
            }
            catch(error) {
                console.log(`Wystąpił błąd ${error}.`)

            }
        })
    }
    else {
        const reqText = `
            SELECT e.id, e.nameOfEvent, e.meComingDate, e.meLeavingDate, e.place, e.description,
            CONCAT('[', GROUP_CONCAT(JSON_OBJECT('id', pp.ID, 'full_name', CONCAT(pp.name, ' ', pp.surname))), ']') AS people_json
            FROM events e
            JOIN event_companion ec ON e.id = ec.event_id
            JOIN party_people pp ON ec.human_id = pp.ID
            WHERE  e.id IN (
                SELECT event_id FROM event_companion WHERE human_id = ?
            )
            AND  e.id IN (
                SELECT event_id FROM event_companion WHERE human_id = ?
            )
            GROUP BY e.id, e.nameOfEvent, e.meComingDate, e.meLeavingDate, e.place, e.description;
        `
        const [queryResult] = await pool.query(reqText, [requestorId, checkedHuman])

        mappedEvents = eventReq.map(event => {
            try {
                const people = JSON.parse(event.people_json)
                const eventStartDateString = createDateString(event.meComingDate)
                const eventStopDateString = createDateString(event.meLeavingDate)
                let datesString;
                if (eventStartDateString != eventStopDateString) {
                    datesString = `${eventStartDateString} - ${eventStopDateString}`
                }
                else {
                    datesString = eventStartDateString
                }
                console.log(datesString)
                return {
                    "id": event.id,
                    "datesString": datesString,
                    "shortName": event.nameOfEvent,
                    "longDesc": event.description,
                    "place": event.place,
                    "people_json": people.map((human) => ({
                        ...human,
                        "photo": getHumanPhotoUrl(parseInt(human.id))
                    }))
                }
                
            }
            catch(error) {
                console.log(`Wystąpił błąd ${error}.`)
            }
        })        

    }
    return mappedEvents
    
}