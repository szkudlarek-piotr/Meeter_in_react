import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cliquesPhotoFolder = path.join(__dirname, "cliques_photos")
export default function getCliquePhoto(cliqueId) {
    const possiblePngName = `${cliqueId}.png`
    const possibleJpgName = `${cliqueId}.jpg`
    const possibleJpegName = `${cliqueId}.jpeg`
    if (fs.existsSync(path.join(cliquesPhotoFolder, possibleJpgName))) {
        return `hhtp://ww`
    } 
    if (fs.existsSync(path.join(cliquesPhotoFolder, possiblePngName))) {
        return possiblePngDir
    }
    if (fs.existsSync(path.join(cliquesPhotoFolder, possibleJpegName))) {
        return possibleJpegDir
    } 
}


//do wywalenia