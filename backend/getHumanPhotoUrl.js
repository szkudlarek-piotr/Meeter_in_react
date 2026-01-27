import path from 'path'
import fs from 'fs'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default function getHumanPhotoUrl(humanId) {
    const photosDir = path.join(__dirname, "photos");
    const photoPath = path.join(photosDir, `${humanId}.jpg`);
    const defaultPhoto = "http://localhost:3000/human-photo/anonymous.jpg";
        
    if (fs.existsSync(photoPath)) {
        return `http://localhost:3000/human-photo/${humanId}.jpg`;
    } else {
        return defaultPhoto;
    }
}