import ControlledTextInput from './Multiuse/SimpleControlledComponents/ControlledTextInput'
import { useState } from 'react'

export default function FrontendToAddClique() {


  const [cliqueData, setCliqueData]  = useState({
    "name": "",
    "photoUrl": ""
  })

  function updateAddedCliqueDetails(attributeName, attributeValue) {
    setCliqueData(prev => ({
      ...prev,
      [attributeName]: attributeValue
    }))
  }

  async function addClique() {
    console.log(cliqueData)
    try {
          const insertResult = await fetch (`http://localhost:3000/add-clique`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              cliqueName: cliqueData.name,
              cliquePhotoUrl: cliqueData.photoUrl
            })
          })
          const responseJson = await insertResult.json();
          console.log(responseJson);

    }
    catch (error) {
      console.log(error)
    }
      
    
  }

  return (
    <div>
      <h2>Nazwa kliki</h2>
      <ControlledTextInput placeholder="Podaj nazwę kliki" id="cliqueNameInput" changeFieldValue={(newValue) => updateAddedCliqueDetails("name", newValue)}/>

      <h2>Link do zdjęcia</h2>
      <ControlledTextInput placeholder="Wklej link do zdjęcia kliki." id="cliquePhotoInput" changeFieldValue={(newValue) => updateAddedCliqueDetails("photoUrl", newValue)}/>

      {/* Lepiej użyć CSS do odstępów zamiast wielu <br/> */}
      <div style={{ marginTop: "20px" }}>
        <button style={{ backgroundColor: 'white', padding: '10px 20px', cursor: 'pointer', border: '1px solid black' }} onClick={() => addClique()}>
          Dodaj klikę
        </button>
      </div>
    </div>
  );
}
