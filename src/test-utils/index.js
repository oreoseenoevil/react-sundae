import { render } from '@testing-library/react'
import { OrderContextProvider } from '../Context/OrderContext'

const renderWithContext = (ui, options) => {
  render(ui, { wrapper: OrderContextProvider, ...options })
}

export * from '@testing-library/react'

export { renderWithContext as render }
