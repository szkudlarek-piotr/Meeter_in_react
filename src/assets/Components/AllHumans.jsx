import { useEffect, useState } from "react";
import SingleHumanTile from "./Multiuse/SingleHumanTile";
import HumanModal from "./Multiuse/HumanModal";



export default function AllHumanTiles() {
    const [humans, setHumans] = useState([])
    const [humanModalData, setHumanModalData] = useState({humanId: 0})

    useEffect(() => {
        fetch(`http://localhost:3000/get-all-humans`).then(response => {
            if (!response.ok) {
                throw new Error("Błąd sieci!")
            }
            return response.json()
        })
        .then(data => {
            setHumans(data);
        })
    }, [])

    function nullifyHumanModalData(){
        setHumanModalData({humanId: 0})
    }
    return (<div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-evenly"}}>
        <HumanModal isDisplayed={humanModalData.humanId > 0} onClose={() =>nullifyHumanModalData()} humanId={humanModalData.humanId}/>
        {humans.map(human => (
            <SingleHumanTile key={human.id}
            photoDir={`http://localhost:3000${human.photoDir}`}
            name={human.name}
            visits={human.visits}
            meetings={human.meetings}
            cliquePhotoAdress={`http://localhost:3000/clique-photo/${human.cliqueId}`}
            cliqueName={human.cliqueName}
            quote={human.quote}
            onClick={() => setHumanModalData({humanId: human.id})}
            />
        ))}
    </div>)
}