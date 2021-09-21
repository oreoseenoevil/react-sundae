import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap'
import { useOrderDetails } from '../../Context/OrderContext'
import { AlertBanner } from '../common/AlertBanner'

export const OrderConfirmation = ({ setOrderPhase }) => {
  const [, , resetOrder] = useOrderDetails()
  const [orderNumber, setOrderNumber] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    axios.post('http://localhost:3030/order')
      .then(res => {
        setOrderNumber(res.data.orderNumber)
      })
      .catch(err => {
        setError(true)
      })
  }, [])

  if (error) {
    return <AlertBanner />
  }

  const handleClick = () => {
    resetOrder()
    setOrderPhase('inProgress')
  }

  if (orderNumber) {
    return (
      <div>
        <h1>Thank you!</h1>
        <p>Your order number is {orderNumber}</p>
        <p>
          as per our terms and conditions, nothing will happen now
        </p>
        <Button onClick={handleClick}>Create new order</Button>
      </div>
    )
  } else {
    return <div>Loading</div>
  }
}
