import { useState, useEffect } from 'react'
import BasicHumanDataFromToken from './BasicHumanDataFromToken.jsx'

export default function BasicDataAboutYou() {

    const [humanInfo, setHumanInfo] = useState({})
    useEffect(() => {
        const getHumanDataFromToken = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/basic-human-data-from-token",
                    {
                        credentials: "include"
                    }
                )
                const receivedInfo = await response.json()
                setHumanInfo(receivedInfo)
            } catch (err) {
                console.log(err)
            }
        }
        getHumanDataFromToken() 
    }, [])

    return (<>
        {humanInfo.data ? (<BasicHumanDataFromToken basicHumanData={humanInfo.data} />) : <h3>Nie jesteś zalogowany</h3>}
    </>)
}