import { useState } from 'react'
import { Input_Form } from './components/input/form/input_form'
import { Output_Results } from './components/output/output_results'
import { Modal_Display } from './components/input/modal/modal_display'
import { Form_Data_Display } from './components/input/filled form/form_data_display'
import { Output_Loading } from './components/output/output_loading'
import { Output_Controls } from './components/output/output_controls'
import { AnimatePresence } from 'motion/react'
import { recommendSearchCall } from './util/apiSearch'
import { Header } from './components/misc/header/header'
import { Header_Info } from './components/misc/header/header_info'

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
    
    const data = await recommendSearchCall(inputData)
  
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
    setSubmitted(false)
    setOutputError('')
    setModalOpen(true)
    setOutputData([])
    
  }

  const handleResubmit = async() => {
    await handleFormSubmit(currentFormData.formData)
  }


  return (
    <>
    <div className="bg"></div>
    <main>
      <Header/>
      <Header_Info/>
      <div className="app-content">
        <AnimatePresence>
          {modalOpen &&
            <Modal_Display isOpen={modalOpen}
            key={'modal-display'}>
              <Input_Form
              handleFormSubmit={handleFormSubmit}
              setCurrentFormData={setCurrentFormData}/>
            </Modal_Display>
          }


  
          {submitted &&
          <Form_Data_Display formData={currentFormData}
          load={load}
          handleStartOver={handleStartOver}
          key={'form-display'}/>
          }
   

    
          {submitted && load &&
            <Output_Loading
            key={'output-loading'}/>
          }
      

        {!load && submitted && (
          <>

            <Output_Controls 
            key={'output-controls'}
            handleResubmit={handleResubmit}
            handleStartOver={handleStartOver}/>

            <Output_Results outputData={outputData} error={outputError}
            key={'output-results-co'}/>

          </>
          )}
        </AnimatePresence>
          
      </div>
    </main>
    </>
  )
}


export default App
