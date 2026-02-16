import styled from 'styled-components'
import { useEffect, useState } from "react";

import SingleTripInHumanModal from './SingleTripInHumanModal';

export default function TripsDataInModal({humanId}) {
    const [tripsData, setTripsData] = useState([])

    useEffect(() => {
        const getHumanTrips = async () => {
            const tripsReq = await fetch(`http://localhost:3000/human-trips?humanId=${humanId}`)
            const tripsJson = await tripsReq.json()
            setTripsData(tripsJson)
        }
        getHumanTrips()
    }, [])

    const mappedTrips = tripsData.map((trip) => (
        <SingleTripInHumanModal dateStart={trip.trip_start} dateStop={trip.trip_stop} shortDesc={trip.short_desc} photosArr={trip.photos} places={trip.places} companion={trip.companion}/>))

    return (
        <>
            {mappedTrips}       
        </>

    )
}