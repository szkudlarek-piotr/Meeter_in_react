import { useEffect, useState } from "react";
import SingleHumanTile from "./SingleHumanTile";

export default function AllHumanTiles() {
    const [humans, setHumans] = useState([])

    useEffect(() => {
        fetch(`http://localhost:3000/get-humans`).then(response => {
            if (!response.ok) {
                throw new Error("Błąd sieci!")
            }
            return response.json()
        })
        .then(data => setHumans(data))
    }, [])
    return (<div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-evenly"}}>
        {humans.map(human => (
            <SingleHumanTile key={human.id}
            photoDir={`http://localhost:5000${human.photoDir}`}
            name={human.name}
            visits={human.visits}
            meetings={human.meetings}
            quote={human.quote}
            cliqueName={human.cliqueName}
            cliquePhoto={human.cliquePhoto}
            />
        ))}
    </div>)
}