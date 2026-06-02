import styled from "styled-components";



const CliqueComponentStyle = styled.div`
    width: 26%;
    border-radius: 10px;
    border: 1px solid black;
    margin: 3%;
`
const CliquePhoto = styled.img`
    margin: 10%;
    width: calc(80% - 2px);
    border: 1px solid black;
    border-radius: 10px;
    margin-bottom: 0px;
`

const HumanContainer = styled.div`
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin-bottom: 10px;
`

const MemberPhoto = styled.img`
    width: 20%;
    border-radius: 5px;
    border: 1px solid black;
    margin: 3x;
    margin-top: 3px;
`



export default function SingleClique({cliqueId, cliquePhotoUrl, cliqueName, members}) {
    const mappedMembers = members.map((human) => (
        <MemberPhoto src={human.human_photo} title={human.human_name} 
    />
    ))

    return (
        <CliqueComponentStyle>
            <CliquePhoto src={cliquePhotoUrl} />
            <h3>{cliqueName}</h3>
            <HumanContainer>
                {mappedMembers}
            </HumanContainer>
        </CliqueComponentStyle>
    )
}