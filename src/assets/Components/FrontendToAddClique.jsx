import SimpleTextInput from "./SimpleTextInput";
import { useState } from 'react'

export default function FrontendToAddClique() {


  const [cliqueData, setCliqueData]  = useState({
    "name": "",
    "photoUrl": ""
  })

  function updateAddedCliqueDetails(attributeName, attributeValue) {
    setCliqueData(prev => ({
      ...prev,
      attributeName: attributeValue
    }))
  }

  return (
    <div>
      <h2>Nazwa kliki</h2>
      <SimpleTextInput placeholder="Podaj nazwę kliki" id="cliqueNameInput" />

      <h2>Link do zdjęcia</h2>
      <SimpleTextInput placeholder="Wklej link do zdjęcia kliki." id="cliquePhotoInput" />

      {/* Lepiej użyć CSS do odstępów zamiast wielu <br/> */}
      <div style={{ marginTop: "20px" }}>
        <button style={{ backgroundColor: 'white', padding: '10px 20px', cursor: 'pointer', border: '1px solid black' }}>
          Dodaj klikę
        </button>
      </div>
    </div>
  );
}
