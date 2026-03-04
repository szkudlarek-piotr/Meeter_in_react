import dotenv from 'dotenv'
import mysql from 'mysql2'
import neo4j from 'neo4j-driver'
dotenv.config()
const pool = mysql.createPool({
    host     : process.env.host,
    user     : process.env.MYSQL_USER,
    database : process.env.MYSQL_DATABASE
}).promise()

async function copyAllPeople() {
    const [humans] = await pool.query("SELECT * FROM party_people")
    const people = humans.map(human => ({
        id: human.ID,
        name: human.name,
        surname: human.surname,
        lives_where: human.lives_where,
        gender: human.gender,
        clique_id: human.klika_id,
        fb_link: human.fb_link
        }
    ))
    const query = `
        UNWIND $people AS person
        MERGE (p:Person {id: person.id})
        SET p.name = person.name,
            p.surname = person.surname,
            p.lives_where = person.lives_where,
            p.gender = person.gender,
            p.clique_id = person.clique_id,
            p.fb_link = person.fb_link
    `

    const driver = neo4j.driver(process.env.neo4j_address, neo4j.auth.basic('neo4j', process.env.neo4j_password));
    const session = driver.session()
    await session.run(query, { people })
    await session.close()
    console.log("Dodano ludzi do bazy neo4j.")

}

async function copyAllVisits() {
    const [visitsData] = await pool.query("SELECT * FROM visits")
    const visits = visitsData.map(visit => ({
        id: visit.visit_id,
        date: visit.visit_date
            ? visit.visit_date.toISOString().split("T")[0]
            : null,
        duration: visit.visit_duration,
        short_desc: visit.short_description,
        place: visit.place_id
    }))
    const query = `
    UNWIND $visits AS visit
    MERGE (v:Visit {id: visit.id})
    SET v.date = date(visit.date),
        v.duration = visit.duration,
        v.short_desc = visit.short_desc,
        v.place = visit.place
    `
    const driver = neo4j.driver(process.env.neo4j_address, neo4j.auth.basic('neo4j', process.env.neo4j_password));
    const session = driver.session()
    await session.run(query, { visits })
    await session.close()
    console.log("Dodano wizyty do bazy neo4j.")
}

async function copyVisitGuest() {
    const [visitGuestQuery] = await pool.query("SELECT visit_id, guest_id FROM visit_guest")
    const records = visitGuestQuery.map(record => ({
        human_id: record.guest_id,
        visit_id: record.visit_id
    }))
    const vgQueryNeo4j = `
        UNWIND $records AS record
        MATCH (p:Person {id: record.human_id})
        MATCH (v:Visit {id: record.visit_id})
        MERGE (p)-[:ATTEND]->(v)
    `
    const driver = neo4j.driver(process.env.neo4j_address, neo4j.auth.basic('neo4j', process.env.neo4j_password));
    const session = driver.session()
    await session.run(vgQueryNeo4j, { records })
    await session.close()
    console.log("Dodano gości do wizyt.")
}


async function copyAllMeetings() {
    const [meetingsData] = await pool.query("SELECT * FROM meetings")
    const meetings = meetingsData.map(meeting => ({
        id: meeting.ID,
        date: meeting.meeting_date
            ? meeting.meeting_date.toISOString().split("T")[0]
            : null,
        short_desc: meeting.short_description,
        place: meeting.Place,
        place_id: meeting.place_id
    }))
    const query = `
    UNWIND $meetings AS meeting
    MERGE (m:Meeting {id: meeting.id})
    SET m.date = date(meeting.date),
        m.short_desc = meeting.short_desc,
        m.place = meeting.place,
        m.place_id = meeting.place_id
    `
    const driver = neo4j.driver(process.env.neo4j_address, neo4j.auth.basic('neo4j', process.env.neo4j_password));
    const session = driver.session()
    await session.run(query, { meetings })
    await session.close()
    console.log("Dodano spotkania do bazy neo4j.")
}


async function copyMeetingHuman() {
    const [meetingHumanQuery] = await pool.query("SELECT meeting_id, human_id FROM meeting_human")
    const records = meetingHumanQuery.map(record => ({
        human_id: record.human_id,
        meeting_id: record.meeting_id
    }))
    const mhQueryNeo4j = `
        UNWIND $records AS record
        MATCH (p:Person {id: record.human_id})
        MATCH (m:Meeting {id: record.meeting_id})
        MERGE (p)-[:TOOK_PART]->(m)
    `
    const driver = neo4j.driver(process.env.neo4j_address, neo4j.auth.basic('neo4j', process.env.neo4j_password));
    const session = driver.session()
    await session.run(mhQueryNeo4j, { records })
    await session.close()
    console.log("Dodano osoby do spotkań.")
}


async function copyAllEvents() {
    const [eventsData] = await pool.query("SELECT * FROM events")
    const events = eventsData.map(event => ({
        id: event.id,
        dateStart: event.dateStart ? event.dateStart.toISOString().split("T")[0] : null,
        dateStop: event.dateStop ? event.dateStop.toISOString().split("T")[0] : null,
        comingDate: event.meComingDate ? event.meComingDate.toISOString().split("T")[0] : null,
        leavingDate: event.meLeavingDate ? event.meLeavingDate.toISOString().split("T")[0] : null,
        short_desc: event.nameOfEvent,
        place: event.place,
        place_id: event.place_id
    }))
    const query = `
    UNWIND $events AS event
    MERGE (e:Event {id: event.id})
    SET e.dateStart = date(event.dateStart),
        e.dateStop = date(event.dateStop),
        e.comingDate = date(event.comingDate),
        e.leavingDate = date(event.leavingDate),
        e.short_desc = event.short_desc,
        e.place = event.place,
        e.place_id = event.place_id
    `
    const driver = neo4j.driver(process.env.neo4j_address, neo4j.auth.basic('neo4j', process.env.neo4j_password));
    const session = driver.session()
    await session.run(query, { events })
    await session.close()
    console.log("Dodano eventy do bazy neo4j.")
}


async function copyEventCompanion() {
    const [eventHumanQuery] = await pool.query("SELECT event_id, human_id FROM event_companion")
    const records = eventHumanQuery.map(record => ({
        human_id: record.human_id,
        event_id: record.event_id
    }))
    const mhQueryNeo4j = `
        UNWIND $records AS record
        MATCH (p:Person {id: record.human_id})
        MATCH (e:Event {id: record.event_id})
        MERGE (p)-[:EVENT]->(e)
    `
    const driver = neo4j.driver(process.env.neo4j_address, neo4j.auth.basic('neo4j', process.env.neo4j_password));
    const session = driver.session()
    await session.run(mhQueryNeo4j, { records })
    await session.close()
    console.log("Dodano osoby do spotkań.")
}


//copyAllPeople()
//copyAllVisits()
//copyVisitGuest()
//copyAllMeetings()
//copyMeetingHuman()
//copyAllEvents()
//copyEventCompanion()