import { useState } from 'react'
import { Input_Form } from './components/input/form/input_form'
import { Output_Results } from './components/output/output_results'
import { Modal_Display } from './components/input/modal/modal_display'
import { Form_Data_Display } from './components/input/filled form/form_data_display'
import { Input_Reset_Button } from './components/input/form/form components/input type/input search display/input_reset_button'
import { Form_Resubmit_Button } from './components/input/form/form_resubmit_button'

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
    if(data.length < 1) {
      setOutputError('No results!')
    }

    setLoad(false)
}

  const handleStartOver = () => {
    setLoad(true)
    setSubmitted(false)
    setModalOpen(true)
    setOutputData({})
    setOutputError('')
    
  }

  const handleResubmit = async() => {
    await handleFormSubmit(currentFormData.formData)
  }


  return (
    <>
    <div className="bg"></div>
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
          <>
            <div className="app-buttons">
              <Input_Reset_Button handleReset={handleStartOver}/>
              <Form_Resubmit_Button handleResubmit={handleResubmit}/>
            </div>
            <Output_Results outputData={outputData} error={outputError}/>
          </>
          )}
      </div>
    </main>
    </>
  )
}


export default App
