import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { OrderEntry } from './Components/Entry/OrderEntry'
import { OrderConfirmation } from './Components/OrderConfirmation'
import { OrderSummary } from './Components/OrderSummary'
import { OrderContextProvider } from './Context/OrderContext'

function App() {
  const [orderPhase, setOrderPhase] = useState('inProgress')

  let Component = OrderEntry

  switch (orderPhase) {
    case 'inProgress':
      Component = OrderEntry
      break
    case 'review':
      Component = OrderSummary
      break
    case 'completed':
      Component = OrderConfirmation
      break
    default:
  }

  return (
    <OrderContextProvider>
      <Container>
        {<Component setOrderPhase={setOrderPhase} />}
      </Container>
    </OrderContextProvider>
  )
}

export default App
