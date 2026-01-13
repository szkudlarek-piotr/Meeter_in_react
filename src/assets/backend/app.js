import express, { response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import fs from 'fs'
import path from "path"
import { fileURLToPath } from "url"
import getFinalHumans from "./getFinalHumans.js"
import getHumanFromSubstring from './getHumanFromNameSubstring.js'
import getPlaceFromSubstring from './getPLaceFromInputString.js'
import getHumanFromSubstringSortedFiltered from './getHumanFromSubstringSortedFiltered.js'
import addMeeting from './addMeeting.js'
import addHumansToMeeting from './addHumansTOMeeting.js'
import addVisitingHuman from './addVisitingHuman.js'
import addVisit from './addVisit.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/human-photo", express.static(path.join(__dirname, "photos")));
app.use("/event-photo", express.static(path.join(__dirname, "events")));

function getHumanPhotoUrl(humanId) {
  const photosDir = path.join(__dirname, "photos");
  const photoPath = path.join(photosDir, `${humanId}.jpg`);
  const defaultPhoto = "/photos/anonymous.jpg";

  if (fs.existsSync(photoPath)) {
    return `/human-photo/${humanId}.jpg`;
  } else {
    return defaultPhoto;
  }
}

app.get("/api/human-photo/:id", (req, res) => {
  const humanId = req.params.id;
  const photoUrl = getHumanPhotoUrl(humanId);
  res.json({ photoUrl });
});


function getEventPhotoUrl(eventPhotoInput) {
  const eventsPhotosList = fs.readdirSync('./events/');

  let returnedArr = []
  for (let photo of eventsPhotosList) {
    if (photo.split('.')[0].includes(eventPhotoInput)) {
      returnedArr.push({name:photo.split('.')[0], photoFileName: `${photo}`})
    }
  }
  console.log(returnedArr)
  return returnedArr
}


function getCliquePhotoUrl(cliqueId) {
  const photosDir = path.join(__dirname, "cliques_photos");
  const jpgPhotoPath = path.join(photosDir, `${cliqueId}.jpg`);
  const pngPhotoPath = path.join(photosDir, `${cliqueId}.png`);
  const defaultPhoto = "/clique-photo/default.jpg"; // jeśli chcesz mieć obrazek zastępczy

  if (fs.existsSync(jpgPhotoPath)) {
    return `/clique-photo/${cliqueId}.jpg`;
  } else if (fs.existsSync(pngPhotoPath)) {
    return `/clique-photo/${cliqueId}.png`;
  } else {
    return defaultPhoto;
  }
}

app.get("/eventPhotos", (req,res) => {
  const photoInput = req.query.inputText
  try {
    const matchingPhotos = getEventPhotoUrl(photoInput)
    res.send(matchingPhotos)
  }
  catch (error) {
    res.send(error)
  }
})

app.get("/clique-photo/:id", (req, res) => {
  const cliqueId = req.params.id;
  const photosDir = path.join(__dirname, "cliques_photos");
  const jpgPhoto = path.join(photosDir, `${cliqueId}.jpg`);
  const pngPhoto = path.join(photosDir, `${cliqueId}.png`);

  if (fs.existsSync(jpgPhoto)) {
    res.sendFile(jpgPhoto);
  } else if (fs.existsSync(pngPhoto)) {
    res.sendFile(pngPhoto);
  } 
});

app.get("/get-all-humans", async(req, res) => {
    const humansReq = await getFinalHumans()
    res.send(humansReq)
})

app.get("/get-human-from-substring", async(req, res) => {
  const deliveredSubstring = req.query.substring
  const chosenPeople = await getHumanFromSubstring(deliveredSubstring)
  res.send(chosenPeople)
})

app.get("/get-humans-sorted-filtered", async(req, res) => {
  const substring = req.query.substring
  const mode = req.query.mode
  const excludedIds = req.query.excludedIds
  try {
    const chosenPeople = await getHumanFromSubstringSortedFiltered(substring, mode, excludedIds)
    res.send(chosenPeople)
  }
  catch(error) {
    console.log(error)
  }

})

app.get("/get-places-from-substring", async(req, res) => {
  const inputString = req.query.placeInput
  const returnedPlaces = await getPlaceFromSubstring(inputString)
  console.log(returnedPlaces)
  res.send(returnedPlaces)
})


app.post("/add-meeting", async(req, res) => {
  const date = req.query.date
  const placeText = req.query.placeText
  const placeId = req.query.placeId
  const shortDesc = req.query.shortDesc
  const longDesc = req.query.longDesc
  try {
    const addReqResult = await addMeeting(date, shortDesc, longDesc, placeText, placeId)
    res.send(addReqResult)
  }
  catch (error) {
    res.send(error)
  }
})

app.post("/add-humans-to-meeting", async(req, res) => {
  const meetingId = req.body.meetingId
  const humanIds = req.body.humanIds
  try {
    const response = await addHumansToMeeting(meetingId, humanIds)
    res.send(response)
  }
  catch(error) {
    res.send(error)
  }
})

app.post("/add-visit", async(req, res) => {
  const visitDate = req.body.date
  const visitDuration = req.body.duration
  const shortDesc = req.body.shortDesc
  const longDesc = req.body.longDesc
  try {
    const response = await addVisit(visitDate, shortDesc, longDesc, visitDuration)
    res.send(response)
  }
  catch(error) {
    res.send(error)
  }
})

app.post("/add-visiting-humans", async(req, res) => {
  const visitId = req.body.visitId
  const humanIds = req.body.humanIds
  try {
    const result = await addVisitingHuman(visitId, humanIds)
    res.send(result)
  }
  catch(error) {
    res.send(error)
  }
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})