import styled from "styled-components";
import sanitizeHtml from 'sanitize-html';
import { useEffect, useState } from "react";
import ControlledTextArea from '../SimpleControlledComponents/ControlledTextArea.jsx'
import RadioOptionsPicker from '../RadioOptionsPicker.jsx'

const StyledButton = styled.button`
    width: 50%;
    background-color: beige;
    margin-bottom: 80px;
    border: 2px solid black;
    margin-top: 20px;
    font-weight: 900;
    font-size: 30px;
    margin-left: auto;
    margin-right: auto;
    &:hover {
        background-color: red;
    }

`

const StyledTextContainer = styled.div`
  font-size: 24px;
  font-family: cursive;
  padding: 0 5%;
  overflow-y: auto;

  flex: 1;
  min-height: 0; 
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;


const StyledQuoteInQuotesList = styled.div`
  padding: 6px 0;
  width: 90%;

  font-family: "Cormorant Garamond", serif;
  font-size: 26px;
  font-style: italic;
  line-height: 1.7;

  color: #3b2f2f;
  text-align: center;
  text-shadow: 0.4px 0.4px 0.8px rgba(0,0,0,0.15);
  border-bottom: 1px dotted rgba(0, 0, 0, 0.25);
`


export default function QuotesDataInModal({humanId, headerText}) {
  const [quoteData, setQuoteData] = useState([])
  const [quoteInserterState, setQuoteInserterState] = useState(setInitialState())



    function setInitialState() {
        return {
            quoteValue: "",
            isPublic: 1
        }
    }  

    function setSingleProperty(propertyName, changedValue) {
        setQuoteInserterState(prevState => ({
            ...prevState,
            [propertyName]: changedValue
        }))
    }


    const getHumanQuotes = async () => {
      const fetchResult = await fetch(
        `http://localhost:3000/get-human-quotes?humanId=${humanId}`
      )
      const quotesJson = await fetchResult.json()
      console.log(quotesJson)
      setQuoteData(quotesJson)
    }


    useEffect(() => {
      getHumanQuotes()
    }, [quoteData])





    function setQuotePrivacy(e) {
        setSingleProperty("isPublic", e.target.value)
    }

    const addHumanQuote = async () => {
      const addQuoteReq = await fetch(`http://localhost:3000/add-quote`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          humanId: humanId,
          quote: quoteInserterState.quoteValue,
          isPublic: quoteInserterState.isPublic
        })
        }
      )
      const addQuoteJson = await addQuoteReq.json()
      if (addQuoteReq.ok && quoteInserterState.isPublic == "1") {
        getHumanQuotes()
      }
      setQuoteInserterState(setInitialState())
    }
    
  

  let mappedQuotes = quoteData.map((quote) => (
    
      <StyledQuoteInQuotesList key={quote.quote_id}
        dangerouslySetInnerHTML={{
          __html: `"${sanitizeHtml(quote.quote)}"`,
        }}
      />
  ))

  return (
      <>
        
        
        <StyledTextContainer>
          <h2 style={{fontSize: "36px", fontWeight: "700"}}>{headerText}</h2>
          {mappedQuotes}
          <h2>Dodaj nowy cytat</h2>
          <ControlledTextArea style={{marginLeft: "auto", marginRight: "auto"}} id="quoteInputForGivenPerson" height="200px" placeholderValue="Wpisz nowy cytat!" fieldValue={quoteInserterState.quoteValue} changeFieldValue={(v) =>setQuoteInserterState(prev => ({ ...prev, quoteValue: v }))} />
          <RadioOptionsPicker header="Czy cytat ma być publiczny?" options={[ { value: "1", text: "Tak" }, { value: "0", text: "Nie" }]} chosenOptionName={quoteInserterState.isPublic} onChangeFunction={setQuotePrivacy} /> <br/>          
          <StyledButton onClick={() => {addHumanQuote()}}>Dodaj cytat</StyledButton>
        </StyledTextContainer>
        
      </>
  )

}