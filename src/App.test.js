import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

test('order phases for happy path', async () => {
  render(<App />)

  // Add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla'
  })

  const cherriesCheckbox = await screen.findByRole('checkbox', {
    name: 'Cherries'
  })

  // Add 2 vanilla scoops
  userEvent.clear(vanillaInput)
  userEvent.type(vanillaInput, '2')

  // add 1 chocolate scoops
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate'
  })
  userEvent.clear(chocolateInput)
  userEvent.type(chocolateInput, '1')

  // Add cherries topping
  userEvent.click(cherriesCheckbox)

  // find and click order button
  const orderSummaryButton = screen.getByRole('button', {
    name: /order sundae/i
  })
  userEvent.click(orderSummaryButton)

  // check summary information based on order
  const summaryHeading = screen.getByRole('heading', {
    name: 'Order Summary'
  })
  expect(summaryHeading).toBeInTheDocument()

  const scoopHeading = screen.getByRole('heading', {
    name: 'Scoops: $6.00'
  })
  expect(scoopHeading).toBeInTheDocument()

  const toppingHeading = screen.getByRole('heading', {
    name: 'Toppings: $1.50'
  })
  expect(toppingHeading).toBeInTheDocument()

  // check summary option items
  expect(screen.getByText('2 Vanilla')).toBeInTheDocument()
  expect(screen.getByText('1 Chocolate')).toBeInTheDocument()
  expect(screen.getByText('Cherries')).toBeInTheDocument()

  // accept terms & conditions and click button to confirm order
  const tcCheckbox = screen.getByRole('checkbox', {
    name: /terms and conditions/i
  })

  userEvent.click(tcCheckbox)

  // click 'new order' button on confirmation page
  const orderConfirmationButton = screen.getByRole('button', {
    name: /confirm order/i
  })
  userEvent.click(orderConfirmationButton)

  const loading = screen.getByText(/loading/i)
  expect(loading).toBeInTheDocument()

  // check confirmation page
  const thankYouHeader = await screen.findByRole('heading', {
    name: /thank you/i
  })

  expect(thankYouHeader).toBeInTheDocument()

  // check loading has disappeared
  const notLoading = screen.queryByText(/loading/i)
  expect(notLoading).not.toBeInTheDocument()

  const orderNumber = await screen.findByText(/order number/i)
  expect(orderNumber).toBeInTheDocument()

  const newOrderButton = screen.getByRole('button', {
    name: /new order/i
  })

  userEvent.click(newOrderButton)

  // check that scoops and toppings subtotals have been reset
  const scoopsSubtotal = screen.getByText('Scoops total: $0.00')
  const toppingsSubtotal = screen.getByText('Toppings total: $0.00')

  expect(scoopsSubtotal).toBeInTheDocument()
  expect(toppingsSubtotal).toBeInTheDocument()

  // do we need to await anything to avoid test errors?
  await screen.findByRole('spinbutton', {
    name: 'Vanilla'
  })

  await screen.findByRole('checkbox', {
    name: 'Cherries'
  })
})

test('Toppings header should not on summary page if no toppings ordered', async () => {
  render(<App />)

  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla'
  })

  // Input 2 Vanilla Scoops and has a grandTotal of 4.00
  userEvent.clear(vanillaInput)
  userEvent.type(vanillaInput, '2')

  const orderSummaryButton = screen.getByRole('button', {
    name: /order sundae/i
  })
  userEvent.click(orderSummaryButton)

  const summaryHeading = screen.getByRole('heading', {
    name: 'Order Summary'
  })
  expect(summaryHeading).toBeInTheDocument()

  const scoopHeading = screen.getByRole('heading', {
    name: 'Scoops: $4.00'
  })
  expect(scoopHeading).toBeInTheDocument()

  const toppingHeading = screen.queryByRole('heading', {
    name: /toppings:/i
  })

  expect(toppingHeading).not.toBeInTheDocument()
})
