import { useState } from 'react'
import { Input_Form } from './components/input_form/input_form'
import { Output_Results } from './components/output/output_results'

function App() {

  const [ currentFormData, setCurrentFormData ] = useState({})
  const [ outputData, setOutputData ] = useState([])
  const [ load, setLoad ] = useState(true)

  async function handleFormSubmit(inputData) {
    setLoad(true)
    
    console.log(`current form inputs: `, currentFormData)
    const response = await fetch('/api/ai', {
        method : 'POST',
        headers : { 'Content-Type' : 'application/json' },
        body : JSON.stringify({ 
            inputData
         })
    })
    
    const data = await response.json()
    setOutputData(data)
    console.log(`response: `, data)

    setLoad(false)

    
}

  return (
    <>
    <main>
      <Input_Form handleFormSubmit={handleFormSubmit} setCurrentFormData={setCurrentFormData}/>
      {!load && (
        <Output_Results outputData={outputData}/>
      )}
    </main>
    </>
  )
}

export default App
