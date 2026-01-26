import mysql from 'mysql2'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from "url"
import getEventPhotoFromId from './getEventPhotoFromId.js'
import getEventPhotoFromGenericPhoto from './getEventPhotoFromGenericPhoto.js'


dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE
}).promise()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getHumanPhotoUrl(humanId) {
    const photosDir = path.join(__dirname, "photos")
    const photoPath = path.join(photosDir, `${humanId}.jpg`)
    const defaultPhoto = "http://localhost:3000/human-photo/anonymous.jpg"

    return fs.existsSync(photoPath) ? `http://localhost:3000/human-photo/${humanId}.jpg`: defaultPhoto
}

export default async function getCalendar(year) {

    const daysObjects = {}

    let current = new Date(year, 0, 1)
    const end = new Date(year, 11, 31)

    while (current <= end) {
        const dayKey = current.toLocaleDateString('sv-SE')
        daysObjects[dayKey] = {
            photos: [],
            interactionsDict: {},
            class: ""
        }
        current.setDate(current.getDate() + 1)
    }

    // ================= VISITS =================

    const visitsQueryText = `
        SELECT 
            visits.visit_date AS visitDate,
            visits.visit_duration AS visitDuration,
            visits.short_description AS visitShortDesc,
            party_people.id AS humanId
        FROM visit_guest
        LEFT JOIN visits ON visits.visit_id = visit_guest.visit_id
        LEFT JOIN party_people ON party_people.id = visit_guest.guest_id
        WHERE 
            YEAR(visits.visit_date) = ?
            OR YEAR(DATE_ADD(visits.visit_date, INTERVAL visits.visit_duration - 1 DAY)) = ?
    `

    const [visitsData] = await pool.query(visitsQueryText, [year, year])

    for (const visit of visitsData) {
        const startDate = new Date(visit.visitDate)
        const duration = visit.visitDuration ?? 1

        for (let i = 0; i < duration; i++) {
            const day = new Date(startDate)
            day.setDate(startDate.getDate() + i)

            const dayKey = day.toLocaleDateString('sv-SE')
            if (!daysObjects[dayKey]) continue

            const interactionKey = startDate.toLocaleDateString('sv-SE')

            daysObjects[dayKey].interactionsDict[interactionKey] = visit.visitShortDesc

            const photo = getHumanPhotoUrl(visit.humanId)
            if (!daysObjects[dayKey].photos.includes(photo)) {
                daysObjects[dayKey].photos.push(photo)
            }

            if (!daysObjects[dayKey].class.includes("visit")) {
                daysObjects[dayKey].class = "visit"
            }
        }
    }

    const meetingsReqText = `
        SELECT 
            meetings.meeting_date AS meetingDate,
            meetings.short_description AS shortDesc,
            meeting_human.human_id AS humanId
        FROM meeting_human
        JOIN meetings ON meetings.ID = meeting_human.meeting_id
        WHERE YEAR(meetings.meeting_date) = ?
    `

    const [meetingsData] = await pool.query(meetingsReqText, [year])

    for (const meeting of meetingsData) {
        const meetingDate = new Date(meeting.meetingDate)
        const meetingDateString = meetingDate.toLocaleDateString('sv-SE')

        if (!daysObjects[meetingDateString]) continue

        const dayObj = daysObjects[meetingDateString]
        const photo = getHumanPhotoUrl(meeting.humanId)

        if (!dayObj.class.includes("meeting")) {
            dayObj.class = dayObj.class
                ? `${dayObj.class}_meeting`
                : "meeting"
        }

        if (!dayObj.photos.includes(photo)) {
            dayObj.photos.push(photo)
        }

        if (!Object.values(dayObj.interactionsDict).includes(meeting.shortDesc)) {
            dayObj.interactionsDict[meetingDateString] = meeting.shortDesc
        }
    }


    const eventsData = `
        SELECT e.id AS id, nameOfEvent AS shortDesc, meComingDate, meLeavingDate, Generic_photo AS genericPhoto, ec.human_id AS humanId
        FROM event_companion ec
        JOIN events e ON e.id = ec.event_id
        WHERE YEAR(meComingDate) = ? OR YEAR(meLeavingDate) = ?
    `
    const [eventsDataReq] = await pool.query(eventsData, [year, year])
    for (let calendarEvent of eventsDataReq) {
        const meComingDate = new Date(calendarEvent.meComingDate)
        const meLeavingDate = new Date(calendarEvent.meLeavingDate)
        const humanPhotoUrl = getHumanPhotoUrl(calendarEvent.humanId)
        const shortDesc = calendarEvent.shortDesc
        let eventPhotoUrl
        if (calendarEvent.genericPhoto.length > 2) {
            eventPhotoUrl = getEventPhotoFromGenericPhoto(calendarEvent.genericPhoto)
        }
        else {
            eventPhotoUrl = getEventPhotoFromId(calendarEvent.id)
        }
        for (let checkedDate=meComingDate; checkedDate<=meLeavingDate; checkedDate.setDate(checkedDate.getDate() + 1)) {
            const dayString = checkedDate.toLocaleDateString('sv-SE')
            if (daysObjects[dayString]["class"] === "") {
                daysObjects[dayString] = {
                    "class": "event",
                    "interactionsDict": {[meComingDate.toLocaleDateString('sv-SE')]: shortDesc},
                    "photos": [humanPhotoUrl, eventPhotoUrl]
                }
            }
            else {
                if (!daysObjects[dayString]["class"].includes("event")) {
                    daysObjects[dayString]["class"] = daysObjects[dayString]["class"] + "_event"
                }

                if (!daysObjects[dayString]["photos"].includes(humanPhotoUrl)) {
                    daysObjects[dayString]["photos"].push(humanPhotoUrl)
                }

                if (!daysObjects[dayString]["photos"].includes(eventPhotoUrl)) {
                    daysObjects[dayString]["photos"].push(eventPhotoUrl)
                }

                if (!Object.values(daysObjects[dayString]["interactionsDict"]).includes(shortDesc)) {
                    daysObjects[dayString]["interactionsDict"] = shortDesc
                }
            }
        }
    }


    const tripsReqText = `
        SELECT c.Date_start AS dateStart, c.Date_stop AS dateStop, c.Place AS shortDesc, cc.human_id AS humanId
        FROM citybreaks c
        JOIN citybreak_companion cc ON c.ID = cc.citybreak_id
        WHERE YEAR(c.Date_start) = ? OR YEAR(c.Date_stop) = ?;
    `
    const [tripsReq] = await pool.query(tripsReqText, [year, year])
    for (let record of tripsReq) {
        const dateStart = new Date(record.dateStart)
        const dateStop = new Date(record.dateStop)
        const shortDesc = record.shortDesc
        const humanPhotoUrl = getHumanPhotoUrl(record.humanId)
        for (let checkedDate=dateStart; checkedDate<=dateStop; checkedDate.setDate(checkedDate.getDate() + 1)) {
            const dayString = checkedDate.toLocaleDateString('sv-SE')
            if (daysObjects[dayString]["class"] === "") {
                daysObjects[dayString] = {
                    "class": "trip",
                    "interactionsDict": {[dateStart.toLocaleDateString('sv-SE')]: shortDesc},
                    "photos": [humanPhotoUrl]
                }
            }
            else {
                if (!daysObjects[dayString]["class"].includes("trip")) {
                    daysObjects[dayString]["class"] = daysObjects[dayString]["class"] + "_trip"
                }
                if (!daysObjects[dayString]["photos"].includes(humanPhotoUrl)) {
                    daysObjects[dayString]["photos"].push(humanPhotoUrl)
                }
                if (!Object.values(daysObjects[dayString]["interactionsDict"]).includes(shortDesc)) {
                    daysObjects[dayString]["interactionsDict"] = shortDesc
                }
            }
        }
    }

    
        for (let dateIdentifier in daysObjects) {
        if (daysObjects[dateIdentifier]["class"] != "wedding") {
            if (Object.keys(daysObjects[dateIdentifier]["interactionsDict"]).length == 1) {
                daysObjects[dateIdentifier]["computedTitle"] = Object.values(daysObjects[dateIdentifier]["interactionsDict"])[0]
            }
            if (Object.keys(daysObjects[dateIdentifier]["interactionsDict"]).length == 2) {
                let sortedKeys = Object.keys(daysObjects[dateIdentifier]["interactionsDict"]).sort()
                let sortedValues = []
                for (let key of sortedKeys) {
                    sortedValues.push(daysObjects[dateIdentifier]["interactionsDict"][key])
                }
                let computedTitle = `${sortedValues[0]} oraz ${sortedValues[1]}`
                daysObjects[dateIdentifier]["computedTitle"] = computedTitle
            }
            if (Object.keys(daysObjects[dateIdentifier]["interactionsDict"]).length > 2) {
                let sortedKeys = Object.keys(daysObjects[dateIdentifier]["interactionsDict"]).sort()
                let sortedValues = []
                for (let key of sortedKeys) {
                    sortedValues.push(daysObjects[dateIdentifier]["interactionsDict"][key])
                }
                let computedTitle = ""
                for (let description of sortedValues.slice(0,-2)) {
                    computedTitle = computedTitle + `${description}, `
                }
                computedTitle = computedTitle + `${sortedValues.at(-2)} `
                computedTitle = computedTitle + `oraz ${sortedValues.at(-1)}`
                daysObjects[dateIdentifier]["computedTitle"] = computedTitle
            }
        }
        else {
            daysObjects[dateIdentifier]["computedTitle"] = daysObjects[dateIdentifier]["title"]
        }
    }
    return daysObjects
}