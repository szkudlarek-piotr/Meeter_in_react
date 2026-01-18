import dotenv from 'dotenv'
import mysql from 'mysql2'
import downloadPhotoFromLink from './downloadPhotoFromLink.js'
import { fileURLToPath } from "url";
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

export default async function addCalendarEvent(eventName, dateStart, dateStop, comingDate, leavingDate, placeName, longDesc, photoAddingInfo, placeId) {
    console.log(eventName, dateStart, dateStop, comingDate, leavingDate, placeName, longDesc, photoAddingInfo, placeId)
    const eventPhotosDir = path.join(__dirname, "events")
    switch (true) {
        case photoAddingInfo.mode == "link" && photoAddingInfo.link.length > 0 && Number.isInteger(placeId): {
            let eventAddingReqText = "INSERT INTO `events` (`id`, `nameOfEvent`, `dateStart`, `dateStop`, `meComingDate`, `meLeavingDate`, `place`, `Generic_photo`, `description`, `place_id`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            console.log(photoAddingInfo.link)
            const addedPhotoFullName = await downloadPhotoFromLink(photoAddingInfo.link, eventPhotosDir, photoAddingInfo.name)
            console.log(addedPhotoFullName)
            const [photoAddingReq] = await pool.query(eventAddingReqText, [eventName, dateStart, dateStop, comingDate, leavingDate, placeName, addedPhotoFullName, longDesc, placeId])
            console.log(photoAddingReq)
            return photoAddingReq
        }
        case photoAddingInfo.mode == "link" && photoAddingInfo.link.length == 0 && Number.isInteger(placeId): {
            let eventAddingReqText = "INSERT INTO `events` (`id`, `nameOfEvent`, `dateStart`, `dateStop`, `meComingDate`, `meLeavingDate`, `place`, `description`, `place_id`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)"
            let [photoAddingReq] = await pool.query(eventAddingReqText, [eventName, dateStart, dateStop, comingDate, leavingDate, placeName, longDesc, placeId])
            const insertId = photoAddingReq.inssertId
            const addedPhotoFullName = await downloadPhotoFromLink(photoAddingInfo.link, eventPhotosDir, insertId)
            console.log(photoAddingReq)
            return photoAddingReq
        }
        case photoAddingInfo.mode == "link" && photoAddingInfo.link.length > 0 && placeId.length == 0: {
            let eventAddingReqText = "INSERT INTO `events` (`id`, `nameOfEvent`, `dateStart`, `dateStop`, `meComingDate`, `meLeavingDate`, `place`, `Generic_photo`, `description`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)"
            console.log(photoAddingInfo.link)
            const addedPhotoFullName = await downloadPhotoFromLink(photoAddingInfo.link, eventPhotosDir, photoAddingInfo.name)
            const [photoAddingReq] = await pool.query(eventAddingReqText, [eventName, dateStart, dateStop, comingDate, leavingDate, placeName, addedPhotoFullName, longDesc, placeId])
            console.log(photoAddingReq)
            return photoAddingReq
        }
        case photoAddingInfo.mode == "link" && photoAddingInfo.link.length == 0 && placeId.length == 0: {
            let eventAddingReqText = "INSERT INTO `events` (`id`, `nameOfEvent`, `dateStart`, `dateStop`, `meComingDate`, `meLeavingDate`, `place`, `description`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)"
            let [photoAddingReq] = await pool.query(eventAddingReqText, [eventName, dateStart, dateStop, comingDate, leavingDate, placeName, longDesc, placeId])
            const insertId = photoAddingReq.inssertId
            const addedPhotoFullName = await downloadPhotoFromLink(photoAddingInfo.link, eventPhotosDir, insertId)
            console.log(photoAddingReq)
            return photoAddingReq
        }
        case photoAddingInfo.mode == "database" && placeId.length == 0: {
            let eventAddingReqText = "INSERT INTO `events` (`id`, `nameOfEvent`, `dateStart`, `dateStop`, `meComingDate`, `meLeavingDate`, `place`, `Generic_photo`, `description`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)"
            const [photoAddingReq] = await pool.query(eventAddingReqText, [eventName, dateStart, dateStop, comingDate, leavingDate, placeName, photoAddingInfo.name, longDesc])
            console.log(photoAddingReq)
            return photoAddingReq            
        }
        case photoAddingInfo.mode == "database" && Number.isInteger(placeId): {
            let eventAddingReqText = "INSERT INTO `events` (`nameOfEvent`, `dateStart`, `dateStop`, `meComingDate`, `meLeavingDate`, `place`, `Generic_photo`, `description`, `place_id`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            const [photoAddingReq] = await pool.query(eventAddingReqText, [eventName, dateStart, dateStop, comingDate, leavingDate, placeName, photoAddingInfo.name, longDesc, placeId])
            console.log(photoAddingReq)
            return photoAddingReq            
        }
    }
}
//addCalendarEvent("Zaćmienie słońca", "2026-08-12T17:00:00", "2026-08-12T17:00:00", "2026-08-12T17:00:00", "2026-08-12T17:00:00", "", "pierwsze zaćmienie słońca w moim życiu", {"link": "https://upload.wikimedia.org/wikipedia/commons/f/f6/20060329-045.jpg", "name": "zacmienie", "mode": "link"}, "")