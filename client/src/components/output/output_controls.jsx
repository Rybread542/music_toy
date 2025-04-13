import { Input_Reset_Button } from "../input/form/form components/input type/input search display/input_reset_button"
import { Form_Resubmit_Button } from "../input/form/form_resubmit_button"
import { motion } from 'motion/react'

export function Output_Controls({handleStartOver, handleResubmit}) {
    return (
        <motion.div className="app-buttons">
            <Input_Reset_Button handleReset={handleStartOver}
            key={'reset-button'}/>
            <Form_Resubmit_Button handleResubmit={handleResubmit}
            key={'resubmit-button'}/>
        </motion.div>
    )
}