import styled from "styled-components";
import DOMPurify from "dompurify";

const HumanTile = styled.div`
        width: 26%;
        margin-bottom: 40px;
        border-radius: 35px;
        aspect-ratio: 2/3;
        text-align: center;
        border: 1px solid black;
        font-family: "Comic Sans MS";
    &>img {
        width: 80%;
        border: 1px solid black;
        margin: calc(10% - 1px);
        margin-top: 0px;
        border-radius: 35px;
        margin-bottom: 0px;
    }
    &>.fullName {
        margin-left: 10%;
        margin-right: 10%;
        text-align: center;
        padding-bottom: 10px;
        font-size: 24px;
        position: relative;
        top:10px;
    }
    &>.interactionsCounter {
        text-align: center;
        font-size: 20px;
        position: relative;
    }
    &>.golden_quote {
        font-style: italic;
        margin-left: 10%;
        margin-right: 10%;
        margin-bottom: 10px;
        font-family: serif;
    }
    &>.clique_photo {
        margin-top: 10px;
        margin-bottom: 10px;
        width: 20%;
        aspect-ratio: 1/1;
        border-radius: 8.5%;
        border: 1px solid black;
    }
    &:hover {
        background-color: red;
    }
` 


export default function SingleHumanTile({headerText, photoDir, name, visits, meetings, cliquePhotoAdress, cliqueName, quote, onClick}) {
    return (
        <HumanTile onClick={onClick}>
            <h2></h2>
            <img src={photoDir} alt={name} />
            <div className="fullName">{name}</div>
            <div className="interactionsCounter">Liczba wizyt: {visits}</div>
            <div className="interactionsCounter">Liczba spotkań: {meetings}</div>
            <img className="clique_photo" src={cliquePhotoAdress} alt={cliqueName} />
            <div className="golden_quote" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quote) }}
            ></div>
        </HumanTile>
    )
}