import dotenv from 'dotenv'
import mysql from 'mysql2'
import fs from 'fs'
import path from "path"
import { fileURLToPath } from "url"
import getHumanPhotoUrl from './getHumanPhotoUrl.js'
import createDateString from './multiuseFunctions/dateToString.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()

const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()


export default async function getHumanTrips(human_id) {
    const queryText = `
    SELECT c.ID AS trip_id, c.Place AS trip_short_description, c.Date_start AS trip_start, c.Date_stop AS trip_stop, c.long_description, pp.ID AS human_id, CONCAT(pp.name, ' ', pp.surname) AS full_name 
    FROM citybreaks c
    JOIN citybreak_companion cc ON c.ID = cc.citybreak_id
    JOIN party_people pp ON pp.ID = cc.human_id
    WHERE c.ID IN (SELECT citybreak_id FROM citybreak_companion WHERE citybreak_companion.human_id = ?)
    ORDER BY c.Date_start DESC
    `
    const [tripsQuery] = await pool.query(queryText, [human_id])
    const tripsDict = {}
    for (let trip of tripsQuery) {
        if (!tripsDict.hasOwnProperty(trip.trip_id)) {
            tripsDict[trip.trip_id] = {"id": trip.trip_id, "short_desc": trip.trip_short_description, "trip_start": createDateString(trip.trip_start), "trip_stop": createDateString(trip.trip_stop), "companion": [{"name": trip.full_name, "photo": getHumanPhotoUrl(trip.human_id)}]}
        }
        else {
            tripsDict[trip.trip_id]["companion"].push({"name": trip.full_name, "photo": getHumanPhotoUrl(trip.human_id)})
        }
        if (Object.keys(tripsDict).length > 0) {
            for (let tripId of Object.keys(tripsDict)) {
                const tripPlacesDataReq = "SELECT * FROM places WHERE id IN (SELECT place_id FROM trip_place WHERE trip_id = ?)"
                const tripPlacesData = await pool.query(tripPlacesDataReq, [tripId])
                tripsDict[tripId]["places"] = tripPlacesData
            }
        }
        for (let tripId of Object.keys(tripsDict)) {
            tripsDict[tripId]["photos"] = []
            const potentialTripPhotosDir = path.join(__dirname, "trips", String(tripId))
            if (fs.existsSync(potentialTripPhotosDir)) {
                const photosList = fs.readdirSync(potentialTripPhotosDir)
                for (let photo of photosList) {
                    tripsDict[tripId]["photos"].push(`http://localhost:3000/trips/${tripId}/${photo}`)
                }
            }
        }

    }
    return tripsDict
}

