import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default function getEventPhotoFromId(eventId) {
    const eventPhotosFolderPath = path.join(__dirname, "events")
    //console.log(eventPhotosFolderPath)
    const allFiles = fs.readdirSync(eventPhotosFolderPath)


    const fileName = allFiles.find(file =>
        file.startsWith(`${eventId}.`)
    )
    const photoAddress = `http://localhost:3000/event-photo/${fileName}`
    return photoAddress || null 
}