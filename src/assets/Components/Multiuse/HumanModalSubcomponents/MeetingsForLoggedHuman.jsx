import styled from 'styled-components'
import { useEffect, useState } from 'react'
import SingleMeetingOfLoggedHuman from './SingleMeetingForLoggedHuman.jsx'

const HumanSquareInVisit = styled.img`
    width: 10%;
    aspect-ratio: 1/1;
    border: 1px solid black;
    border-radius: 5px;
    justify-content: space-evenly;
    margin: 10px;
`


export default function MeetingsForLoggedUser({humanId}) {
    const [meetingsData, setMeetingsData] = useState([])

    useEffect(() => {
        const getMeetingsDataForLoggedUser = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/humman-meetings-for-logged-user?humanId=${humanId}`,
                    { credentials: "include" }
                )
                const receivedInfo = await response.json()
                console.log(receivedInfo)
                setMeetingsData(Array.isArray(receivedInfo) ? receivedInfo : [])
            }
            catch (error) {
                alert(error)
                setMeetingsData([])
            }
        }
        getMeetingsDataForLoggedUser()
    }, [humanId])

    const mappedMeetings = meetingsData.map((meeting) => {
        console.log(JSON.stringify(meeting.people_json))
        const mappedHumans = meeting.people_json.map((human) => (
            <HumanSquareInVisit src={human.photo} title={human.full_name}/>
        ))

        return <SingleMeetingOfLoggedHuman shortDesc={meeting.shortName} place={meeting.place} date={meeting.dateString} longDesc={meeting.longDesc} mappedHumans={mappedHumans} />
        }
    )
    console.log(meetingsData)

    return (
        <div style={{overflowY: "scroll"}}>
            {mappedMeetings}
        </div>
    )
}