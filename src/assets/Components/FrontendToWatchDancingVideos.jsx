import styled from 'styled-components';
import { useEffect, useState } from 'react';


const BigVideoElement = styled.iframe`
    aspect-ratio: 16/9;
    margin-left: 10%;
    margin-right: 10%;
    border-radius: 15px;
`
const DancingVideoTitle = styled.h2`
    width: 80%;
    margin-left: 10%;
    margin-right: 10%;
`

const DancingVideoThumbnail = styled.img`
    height: 65%;
    margin-top: 5%;
    margin-bottom: 20%;
    border: 1px solid black;
    border-radius: 15px;
    
`

export default function FrontendToWatchDancingVideos() {
    const [videosData, setVideosData] = useState([])
    const [chosenVideoIndex, setChosenVideoIndex] = useState(0)


    useEffect(() => {
        const getDancingVideosData = async () => {
            const videosData = await fetch(`http://localhost:3000/dancing-videos`)
            const videosJson = await videosData.json()
            console.log(videosJson)
            setVideosData(videosJson)
        }
        getDancingVideosData()
    }, [])


    const mappedThumbnails = videosData.map((video, index) => (
        <DancingVideoThumbnail src={`https://img.youtube.com/vi/${video.link}/mqdefault.jpg`} id={`video_number_${index}`} onClick={() => setChosenVideoIndex(index)}/>
    ))

    return(
        <>
            {videosData[chosenVideoIndex] ? 
            <>
                
                <BigVideoElement src={"https://www.youtube.com/embed/" + videosData[chosenVideoIndex]["link"]}></BigVideoElement>
                <DancingVideoTitle>{videosData[chosenVideoIndex]["title"]}</DancingVideoTitle>
            </> 
            : <h2>Nie udało się załadować filmików tanecznych.</h2>}
            
            {
                videosData[chosenVideoIndex]?.hasOwnProperty("long_desc") && <p>{videosData[chosenVideoIndex]["long_desc"]}</p>
            }


            <div style={{height: "180px", width: "90%", overflowX: "scroll", display: "flex", flexWrap: "noWrap", gap: "10px", overflowY: "hidden", marginLeft: "5%", marginRight: "5%"}}>
                {mappedThumbnails}
            </div>
        </>
    )
}