import { useState } from 'react'
import Icon from '../Icon/Icon'
import StepsDialog from './StepsDialog'
import { setStep, setStepPresets } from '../../db/actions'
import './StepPicker.css'

export default function StepPicker({ counter }) {
  const [editing, setEditing] = useState(false)
  const steps = counter.steps ?? [1, 5, 10]

  const save = async (newSteps) => {
    await setStepPresets(counter.id, newSteps)
    setEditing(false)
  }

  return (
    <>
      <div className="step-picker" role="group" aria-label="Step per tap">
        {steps.map((s) => (
          <button
            key={s}
            className={counter.step === s ? 'step step--active' : 'step'}
            onClick={() => setStep(counter.id, s)}
            aria-pressed={counter.step === s}
          >
            +{s}
          </button>
        ))}
        <button className="step step--edit" onClick={() => setEditing(true)} aria-label="Edit step values">
          <Icon name="edit" size={18} />
        </button>
      </div>

      <StepsDialog
        open={editing}
        steps={steps}
        onSave={save}
        onCancel={() => setEditing(false)}
      />
    </>
  )
}