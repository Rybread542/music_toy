import { useState } from 'react'
import { Input_Form } from './components/input_form/input_form'

function App() {

  const [ currentFormData, setCurrentFormData ] = useState({})
  async function handleFormSubmit(formInputs) {

    const response = await fetch('/api/ai', {
        method : 'POST',
        headers : { 'Content-Type' : 'application/json' },
        body : JSON.stringify({ 
            formInputs
         })
    })
    const data = await response.json()

    console.log(`response: ${data.message}`)

    
}

  return (
    <>
    <main>
      <Input_Form handleFormSubmit={handleFormSubmit} setCurrentFormData={setCurrentFormData}/>
    </main>
    </>
  )
}

export default App
