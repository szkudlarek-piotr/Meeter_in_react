import styled from 'styled-components'
import { useEffect, useState } from 'react'

const StyledTextContainer = styled.div`
  font-size: 24px;
  font-family: cursive;
  padding: 0 5%;
  overflow-y: auto;       
  flex: 1;               
  display: flex;
  flex-direction: column;
  align-items: center;      
`

const HumanPhotoInModal = styled.img`
  width: 20%;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid black;
`

const SuperpowersContainer = styled.div`
  display: flex;
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 30px;
  margin-bottom: 0px;
  justify-content: space-evenly;

`

const SuperpowerIcon = styled.img`
  width: 70px;
  height: 70px;
  margin-left: 15px;
  margin-right: 15px;
`


const StyledTable = styled.table`
  border-collapse: collapse;
  border: 3px solid black;   /* gruba obwódka */
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 30px;
`

const StyledTableHeader = styled.th`
  border: 1px solid black;
  min-width: 250px;
`

const StyledTableRow = styled.tr`
  font: Arial;
`

const StyledTableCell = styled.td`
  border: 1px solid black;
  padding: 8px 14px;
`


const OftenSeenWithPhoto = styled.img`
  width: 23%;
  margin: 3%;
  border-radius: 10px;
  border: 1px solid black;
`
const OftenSeenWithContainer = styled.div`
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;


`


export default function BasicHumanData({humanId}) {

    const [basicHumanData, setBasicHumanData] = useState({
        superpowers: [],
        interactionPlacesCategories: [],
        oftenSeenWith: []
    })

    const getBasicHumanData = async () =>{
      const fetchResult = await fetch(`http://localhost:3000/basic-human-info?humanId=${humanId}`)
      const humanDataJson = await fetchResult.json()
      console.log(humanDataJson)
      setBasicHumanData(humanDataJson)
    }

    useEffect(() => {
        getBasicHumanData()
    }, [humanId])



    let mappedSuperpowers = null
    if (basicHumanData.superpowers.length > 0) {
      mappedSuperpowers = basicHumanData.superpowers.map((superpower) => <SuperpowerIcon src={superpower.photo} title={superpower.name}/>)
    }

    let mappedPlaceCategories = null
    if (basicHumanData.interactionPlacesCategories.length > 0) {
      mappedPlaceCategories = basicHumanData.interactionPlacesCategories.map((row) => <StyledTableRow><StyledTableCell>{row.category}</StyledTableCell><StyledTableCell>{row.category_count}</StyledTableCell></StyledTableRow>)
    }

    let mappedOftenSeenWith = basicHumanData.oftenSeenWith.map((human) => (
      <OftenSeenWithPhoto src={human.photoDir} title={human.fullName} />
    ))

    let spouseInfo = ""
    if (basicHumanData.spouse_name && basicHumanData.spouse_name.length > 0) {
      if (basicHumanData.gender = "M") {
        spouseInfo = `Jego żoną jest ${basicHumanData.spouse_name}.`
      }
      if (basicHumanData.gender = "F") {
        spouseInfo = `Jej mężem jest ${basicHumanData.spouse_name}.`
      }
    }


    return (
              <StyledTextContainer>
                <h1>Podstawowe dane</h1>
                <HumanPhotoInModal src={basicHumanData.photoDir}/>
                <SuperpowersContainer className="superpowersContainer">
                  {mappedSuperpowers}
                </SuperpowersContainer>
                <h2>{basicHumanData.fullName}</h2>

                Liczba wizyt: {basicHumanData.visitsCount} <br/>
                Liczba spotkań: {basicHumanData.meetingsCount} <br/>
                Liczba cytatów: {basicHumanData.quotesCount} <br/>
                {spouseInfo.length > 0 && spouseInfo} <br/>
                {basicHumanData.lastSeen}
                
                {mappedOftenSeenWith.length > 0 && (
                  <>
                    <h2>Często widywany z:</h2>
                    <OftenSeenWithContainer>
                      {mappedOftenSeenWith}
                    </OftenSeenWithContainer>
                  </>
                )}

                <h2>Gdzie się widujecie poza tripami?</h2>
                <StyledTable>
                  <tr>
                    <StyledTableHeader>Kategoria miejsca</StyledTableHeader>
                    <StyledTableHeader>Liczba spotkań</StyledTableHeader>
                  </tr>
                  {mappedPlaceCategories}

                </StyledTable>

              </StyledTextContainer>
    )
}