import { useState } from 'react'
import { Input_Form } from './components/input/form/input_form'
import { Output_Results } from './components/output/output_results'
import { Modal_Display } from './components/input/modal/modal_display'
import { Form_Data_Display } from './components/input/filled form/form_data_display'

function App() {

  const [ currentFormData, setCurrentFormData ] = useState({})
  const [ submitted, setSubmitted ] = useState(false)
  const [ outputData, setOutputData ] = useState([])
  const [ load, setLoad ] = useState(true)
  const [ modalOpen, setModalOpen ] = useState(true)
  const [ outputError, setOutputError ] = useState('')

  async function handleFormSubmit(inputData) {
    setLoad(true)
    setSubmitted(true)
    setModalOpen(false)
    setOutputError('')
    setOutputData({})
    
  
    const response = await fetch('/api/ai', {
        method : 'POST',
        headers : { 'Content-Type' : 'application/json' },
        body : JSON.stringify({ 
            inputData
         })
    })
    
    console.log(response)
    const data = await response.json()
    if ('error' in data) {
      setOutputError(data.error)
    }

    else {
      setOutputData(data)
    }
    
    console.log(`response: `, data)
    setLoad(false)
}

  const handleStartOver = () => {
    setSubmitted(false)
    setModalOpen(true)
    setOutputData({})
    setOutputError('')
    
  }


  return (
    <main>
      <div className="app-content">
        <Modal_Display isOpen={modalOpen}>
          <Input_Form
          handleFormSubmit={handleFormSubmit}
          setCurrentFormData={setCurrentFormData}/>
        </Modal_Display>
        {submitted &&
        <Form_Data_Display formData={currentFormData}
        load={load}
        handleStartOver={handleStartOver}/>
        }
        {!load && submitted && (
            <Output_Results outputData={outputData} error={outputError}/>
          )}
      </div>
    </main>
  )
}

export default App
