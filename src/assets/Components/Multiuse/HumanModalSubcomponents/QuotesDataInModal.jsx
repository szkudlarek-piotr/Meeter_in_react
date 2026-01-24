import styled from "styled-components";
import sanitizeHtml from 'sanitize-html';
import { useEffect, useState } from "react";
import InputForAddingUotedFOrPredefinedPerson from "./InputForAddingQuoteForPredefinedPerson";


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


const StyledQuoteInQuotesList = styled.div`
  margin: 22px 12%;
  padding: 6px 0;
  width: 90%

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

    useEffect(() => {

    const getHumanQuotes = async () => {
      const fetchResult = await fetch(
        `http://localhost:3000/get-human-quotes?humanId=${humanId}`
      )
      const quotesJson = await fetchResult.json()
      setQuoteData(quotesJson)
    }

    getHumanQuotes()
  },[])

  let mappedQuotes = quoteData.map((quote) => (
    
      <StyledQuoteInQuotesList key={quote.quote_id}
        dangerouslySetInnerHTML={{
          __html: `"${sanitizeHtml(quote.quote)}"`,
        }}
      />
  ))

  return (

      <StyledTextContainer>
        <h2>{headerText}</h2>
        <InputForAddingUotedFOrPredefinedPerson humanId={humanId}/>
        {mappedQuotes}
      </StyledTextContainer>

  )

}