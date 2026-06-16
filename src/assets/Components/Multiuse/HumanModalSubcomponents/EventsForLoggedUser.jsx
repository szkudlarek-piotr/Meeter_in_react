import styled from 'styled-components'
import { useEffect, useState } from 'react'
import SingleEventForLoggedHuman from './SingleEventOfLoggedHuman'

    const HumanSquareInEvent = styled.img`
        width: 10%;
        aspect-ratio: 1/1;
        border: 1px solid black;
        border-radius: 5px;
        justify-content: space-evenly;
        margin: 10px;
    `


export default function EventsForLoggedUser({humanId}) {
    const [eventsData, setEventsData] = useState([])


    useEffect(() => {
        const getEventsDataForLoggedUser = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/human-events-for-logged-user?humanId=${humanId}`,
                    { credentials: "include" }
                )
                const receivedInfo = await response.json()
                console.log(receivedInfo)
                setEventsData(Array.isArray(receivedInfo) ? receivedInfo : [])
            }
            catch (error) {
                alert(error)
                setEventsData([])
            }
        }
        getEventsDataForLoggedUser()
    }, [humanId])



    const mappedEvents = eventsData.map((event) => {
        console.log(JSON.stringify(event.people_json))
        const mappedHumans = event.people_json.map((human) => (
            <HumanSquareInEvent src={human.photo} title={human.full_name}/>
        ))

        return (
            <SingleEventForLoggedHuman 
                shortDesc={event.shortName} 
                place={event.place} 
                date={event.datesString} 
                longDesc={event.longDesc} 
                mappedHumans={mappedHumans} 
            />
        )
        }
    )

    if (eventsData.length > 0) {
        return (
            <>
                <h1>Eventy</h1>
                <div style={{overflowY: "scroll"}}>{mappedEvents}</div>
            </>

        )
    }
    else {
        return <h2>Nie jesteś zalogowany lub nie macie wspólnych wydarzeń.</h2>
    }


}