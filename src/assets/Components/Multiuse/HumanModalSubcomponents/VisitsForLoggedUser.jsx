import styled from 'styled-components'
import { useEffect, useState } from "react"

const HumanSquareInVisit = styled.img`
    width: 10%;
    aspect-ratio: 1/1;
    border: 1px solid black;
    border-radius: 5px;
`

export default function VisitsForLoggedUser({ humanId }) {
    const [checkedHumanVisitsData, setCheckedHumanVisitsData] = useState([])

    useEffect(() => {
        const getVisitsDataFromToken = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/human-visits-for-logged-user?humanId=${humanId}`,
                    { credentials: "include" }
                )
                const receivedInfo = await response.json()
                console.log(receivedInfo)
                console.log('receivedInfo', receivedInfo, Array.isArray(receivedInfo))

                // zawsze ustawiamy tablicę
                setCheckedHumanVisitsData(Array.isArray(receivedInfo) ? receivedInfo : [])

            } catch (err) {
                console.log(err)
                setCheckedHumanVisitsData([]) // fallback na pustą tablicę
            }
        }

        getVisitsDataFromToken()
    }, [humanId])

    if (checkedHumanVisitsData.length === 0) {
        return <p>Brak wizyt do wyświetlenia</p>
    }

    return (
        <div>
            {checkedHumanVisitsData.map((visit) => {
                const mappedCovisitors = (visit.co_visitors || []).map((human) => (
                    <HumanSquareInVisit title={`${human.name} ${human.surname}`} key={human.id} src={human.photo} />
                ))

                return (
                    <div key={visit.id} style={{ marginBottom: "1.5rem", marginLeft:"10%", width: "80%", justifyContent: "space-evenly" }}>
                        <h2>{visit.name}</h2>
                        <h3>{visit.date}</h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem",  justifyContent: "space-evenly"}}>
                            {mappedCovisitors}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}