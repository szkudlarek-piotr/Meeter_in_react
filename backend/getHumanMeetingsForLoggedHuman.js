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

export default async function getHumanMeetingsForLoggedHuman(token, checkedHuman) {
    const askingHumanIdReqText = `
        SELECT human_id 
        FROM sessions_data 
        WHERE session_token = ?
        AND expire_date > CURRENT_DATE()
    `
    const [askingHumanIdReq] = await pool.query(askingHumanIdReqText, [token])
    const requestorId = askingHumanIdReq[0]["human_id"]
    if (requestorId == 7 || requestorId == 77 || requestorId == checkedHuman) {
        const reqText = `
        SELECT m.ID,  m.short_description, m.meeting_date, m.Place AS place, m.long_desc, 
        CONCAT('[', GROUP_CONCAT(JSON_OBJECT('id', pp.ID, 'full_name', CONCAT(pp.name, ' ', pp.surname))), ']') AS people_json
        FROM meetings m
        JOIN meeting_human mh ON m.ID = mh.meeting_id
        JOIN party_people pp ON mh.human_id = pp.ID
        WHERE m.ID IN (SELECT DISTINCT meeting_id FROM meeting_human WHERE human_id = ?)
        GROUP BY m.ID
        ORDER BY meeting_date DESC;
        `
        const [meetingsReq] = await pool.query(reqText, [checkedHuman])

        const mappedMeetings = meetingsReq.map(meeting => {
        try {
            const people = JSON.parse(meeting.people_json)
            console.log("RAW people_json:", meeting.people_json)
            console.log("PARSED people:", people)
            return {
                "id": meeting.ID,
                "dateString": createDateString(meeting.meeting_date),
                "shortName": meeting.short_description,
                "longDesc": meeting.long_desc,
                "place": meeting.place,
                "people_json": people.map((human) => ({
                    ...human,
                    "photo": getHumanPhotoUrl(parseInt(human.id))
                }))
            }
        } catch(e) {
            console.log("BŁĄD dla meeting ID:", meeting.ID)
            console.log("people_json wartość:", meeting.people_json)
            console.log("Błąd:", e.message)
            return null
        }
    })

        return mappedMeetings
    }
    else {
        const meetingsReqText = `
            SELECT m.ID, m.short_description, m.meeting_date, m.Place AS place, m.long_desc,
            CONCAT('[', GROUP_CONCAT(JSON_OBJECT('id', pp.ID, 'full_name', CONCAT(pp.name, ' ', pp.surname))), ']') AS people_json
            FROM meetings m
            JOIN meeting_human mh_all ON m.ID = mh_all.meeting_id
            JOIN party_people pp ON mh_all.human_id = pp.ID
            WHERE m.ID IN (
                SELECT meeting_id FROM meeting_human WHERE human_id = ?
            )
            AND m.ID IN (
                SELECT meeting_id FROM meeting_human WHERE human_id = ?
            )
            GROUP BY m.ID
            ORDER BY m.meeting_date DESC;
        `
        const [meetingsReq] = await pool.query(meetingsReqText, [checkedHuman, requestorId])
        const mappedMeetings = meetingsReq.map(meeting => {
        try {
            const people = JSON.parse(meeting.people_json)
            return {
                "id": meeting.ID,
                "dateString": createDateString(meeting.meeting_date),
                "shortName": meeting.short_description,
                "longDesc": meeting.long_desc,
                "place": meeting.place,
                "people_json": people.map((human) => ({
                    ...human,
                    "photo": getHumanPhotoUrl(parseInt(human.id))
                }))
            }
        } catch(e) {
            console.log("BŁĄD dla meeting ID:", meeting.ID)
            console.log("people_json wartość:", meeting.people_json)
            console.log("Błąd:", e.message)
            return null
        }
    })
        return mappedMeetings   
    }
}