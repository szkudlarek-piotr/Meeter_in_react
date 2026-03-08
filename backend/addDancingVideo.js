import dotenv from 'dotenv'
import mysql from 'mysql2'
import { Builder, By, until } from 'selenium-webdriver'
import chrome from "selenium-webdriver/chrome.js";
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()
export default async function addDancingVideo(link) {
    let options = new chrome.Options()
    options.addArguments("--log-level=3")
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    let returnedData 
    try {
        await driver.get(link);
        let videoTitle = await driver.getTitle()
        const splittedTitle = videoTitle.split("_")
        const videoTitleInDb = splittedTitle[1].replace(" - YouTube", "").trim()
        const videoDatetime = splittedTitle[0].trim()
        const videoYear = videoDatetime.substring(0, 4)
        const videoMonth = videoDatetime.substring(4, 6)
        const videoDay = videoDatetime.substring(6, 8)

        
        try {
            const showMoreElement = await driver.findElement(By.id("expand"))
            await showMoreElement.click()
        } catch (e) {
            console.log("Nie ma tu czego rozwijać")
        }
        
        const descriptionElement = await driver.wait(until.elementLocated(By.id("attributed-snippet-text")), 5000)
        const videoDescription = await descriptionElement.getText()
        console.log(videoDescription)




        const dateToCheck = `${videoYear}-${videoMonth}-${videoDay}`
        const findEventReqText = `    
        SELECT id 
        FROM events
        WHERE DATE(dateStart) = ?
        `
        const [findEventReq] = await pool.query(findEventReqText, [dateToCheck])
        if (findEventReq.length == 1) {
            console.log("Znaleziono jedno wydarzenie pasujace do daty tego filmiku.")
            const lessonEventId = findEventReq[0]["id"]
            const addVideoReqText = "INSERT INTO `videos` (`id`, `title`, `long_desc`, `date`, `link`, `visit_id`, `meeting_id`, `event_id`, `citybreak_id`) VALUES (NULL, ?, ?, ?, ?, NULL, NULL, ?, NULL);"
            const [addVideoReq] = await pool.query(addVideoReqText, [videoTitleInDb, videoDescription, dateToCheck, link, lessonEventId])
            returnedData = addVideoReq

        }
        else if (findEventReq.length == 0) {
            console.log("Nie znaleziono wydarzeń pasujacych do daty filmiku.")
            const addVideoReqText = "INSERT INTO `videos` (`id`, `title`, `long_desc`, `date`, `link`, `visit_id`, `meeting_id`, `event_id`, `citybreak_id`) VALUES (NULL, ?, ?, ?, ?, NULL, NULL, NULL, NULL);"
            const [addVideoReq] = await pool.query(addVideoReqText, [videoTitleInDb, videoDescription, dateToCheck, link])
            returnedData = addVideoReq
        }
        else {
            console.log("Znaleziono więcej niż jedno wydarzenie pasujące do tej daty.")
            const addVideoReqText = "INSERT INTO `videos` (`id`, `title`, `long_desc`, `date`, `link`, `visit_id`, `meeting_id`, `event_id`, `citybreak_id`) VALUES (NULL, ?, ?, ?, ?, NULL, NULL, NULL, NULL);"
            const [addVideoReq] = await pool.query(addVideoReqText, [videoTitleInDb, videoDescription, dateToCheck, link])
            console.log(addVideoReq)
            returnedData = addVideoReq
        }
        
    }
    catch (error) {
        console.log(error)
        return error
    }
    driver.close()
    return returnedData
}