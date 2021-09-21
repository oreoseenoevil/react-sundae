import { useState } from 'react'
import { Button, Form, OverlayTrigger, Popover } from 'react-bootstrap'

export const SummaryForm = ({setOrderPhase}) => {
  const [isChecked, setIsChecked] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setOrderPhase('completed')
  }

  const popover = (
    <Popover id="termsandconditions-popover">
        No ice cream will actually be delivered.
    </Popover>
  )

  const checkboxLabel = (
    <span>
      I agree to
      <OverlayTrigger placement="right" overlay={popover}>
        <span style={{ color: 'blue' }}>Terms and Conditions</span>
      </OverlayTrigger>
    </span>
  )

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="terms-and-condition">
        <Form.Check
          type="checkbox"
          checked={isChecked}
          onChange={e => setIsChecked(e.target.checked)}
          label={checkboxLabel}
        />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={!isChecked}>
        Confirm Order
      </Button>
    </Form>
  )
}
