import { useEffect, useState } from "react";
import styled from "styled-components";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";


const TwinContainer = styled.div`
    width: 90%;
    margin: auto;
    min-height: 500px;
    display: flex;
    justify-content: space-evenly;
    margin-top: 20px;
    margin-bottom: 50px;

`
const SingleContainer = styled.div`
    min-height: 100%;
    background-color: #80808059;
    width: 45%;
    border: 1px solid black;
    border-radius: 30px;
    
`

const Quote = styled.div`
    border: 1px solid black;
    background-color: white;
    border-radius: 30px;
    width: 80%;
    margin-top: 10px;
    margin-left: 5%;
    margin-right: 5%;
    padding: 5%;
    &:last-child {
        margin-bottom: 10px;
    }
`

    function QuotesColumn({id, children}) {
        const {setNodeRef} = useDroppable({  id, })
        return <SingleContainer ref={setNodeRef}>{children}</SingleContainer>
    }

    
    function DraggableQuote({ quote }) {
        const { attributes, listeners, setNodeRef, transform } = useDraggable({
            id: quote.quote_id
        });

        const style = transform ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
        } : undefined

        return (
            <Quote 
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                dangerouslySetInnerHTML={{__html: quote.quote}}
            />
        )
    }


export default  function FrontendToModifyQuotesPrivacy() {
    const [quotes, setQuotes] = useState({
        public: [],
        private: []
    });

    useEffect(() => {

        const getQuotesData = async () => {
            const quotesReq = await fetch("http://localhost:3000/quotes-for-modifying-privacy", 
                {credentials: "include"}
            );
            const quotesJson = await quotesReq.json();

            const initialDict = {
                public: quotesJson.filter(q => q.is_public == 1),
                private: quotesJson.filter(q => q.is_public == 0),
            }
            setQuotes(initialDict);
        }

        getQuotesData();

    }, [])


    const privateQuotes = quotes.private.map(quote => (
            <DraggableQuote quote={quote} key={quote.quote_id}/>
    ));

    const publicQuotes = quotes.public.map(quote => (
        <DraggableQuote quote={quote} key={quote.quote_id}/>
    ));

    async function changeQuotePrivacy(event) {
        const { active, over } = event;
        if(!over) return;

        const quoteId = active.id;
        const targetColumn = over.id;

        const isCurrentlyPublic = quotes.public.some(q => q.quote_id ===quoteId);
        const sourceColumn = isCurrentlyPublic ? "publicQuotes" : "privateQuotes";


        if (sourceColumn == targetColumn) return;

        const privacyToSet = targetColumn === "publicQuotes" ? 1 : 0;

        try {
            await changeQuotePrivacyInDb(quoteId, privacyToSet);
        }
        catch(error) {
            console.log(`Bład zapistu w bazie danych: ${error}.`);
            return;
        }


        setQuotes(prev => {
            let movedQuote;

            const sourceIsPublic = prev.public.find(q => q.quote_id === quoteId);
            if (sourceIsPublic) {
                movedQuote = sourceIsPublic;
                const movedQuoteId = active.id;
                

                return {
                    public: prev.public.filter(q => q.quote_id !== quoteId),
                    private: [...prev.private, {...movedQuote, is_public: 0}]
                }
                
            }

            const sourceIsPrivate = prev.private.find(q => q.quote_id === quoteId);
            if(sourceIsPrivate) {
                movedQuote = sourceIsPrivate;

                return {
                    private: prev.private.filter(q => q.quote_id !== quoteId),
                    public: [...prev.public, {...movedQuote, is_public: 1}]
                }
            }
            return prev
        })
    }


    const changeQuotePrivacyInDb = async (quoteId, targetPrivacy) => {
        const updatePrivacyReq = await fetch(`http://localhost:3000/update-quote-privacy`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    quoteId: quoteId,
                    targetPrivacy: targetPrivacy
                })
            }
        )
        const response = await updatePrivacyReq.json()
    }

    return (
        <DndContext onDragEnd={changeQuotePrivacy}>
            <h1 style={{marginTop: "2px", marginBottom: "2px"}}>Prywatność Twoich cytatów</h1>
            <TwinContainer>

                <QuotesColumn id="privateQuotes">
                    <h2>Cytaty prywatne</h2>
                    {privateQuotes}
                </QuotesColumn>

                <QuotesColumn id="publicQuotes">
                    <h2>Cytaty publiczne</h2>
                    {publicQuotes}
                    
                </QuotesColumn>

            </TwinContainer>
        </DndContext>
    )
}