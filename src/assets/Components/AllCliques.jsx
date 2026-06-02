import styled from 'styled-components'
import SingleClique from './SIngleClique';
import { useEffect, useState } from 'react'

const CliquesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
`


export default function AllCliques() {

    const [cliquesData, setCliquesData] = useState([]);

    useEffect(() => {
        const getCliquesData = async () => {
            const cliquesDataReq = await fetch(`http://localhost:3000/get-cliques-data`)
            const cliquesDataJson = await cliquesDataReq.json()
            setCliquesData(cliquesDataJson)
        } 
        getCliquesData()
    }, [])

    const mappedCliquesDivs = cliquesData.map((clique) => (
        <SingleClique 
            cliqueId={clique.clique_id} 
            cliquePhotoUrl={clique.clique_photo} 
            cliqueName={clique.clique_name}
            members={clique.members} />
    ))

    return (
        
        <CliquesContainer>
            {mappedCliquesDivs}
        </CliquesContainer>
    )
}