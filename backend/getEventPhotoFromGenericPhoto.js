import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default function getEventPhotoFromGenericPhoto(genericPhotoName) {
    const photoAddress = `http://localhost:3000/event-photo/${genericPhotoName}`
    return photoAddress || null 
}