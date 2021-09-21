import { render, screen, waitFor } from '../../../test-utils'
import { OrderEntry } from '.'
import { rest } from 'msw'
import { server } from '../../../mocks/server'
import userEvent from '@testing-library/user-event'

test('handles error for scoops and toppings route', async () => {
  server.resetHandlers(
    rest.get('http://localhost:3030/scoops', (req, res, ctx) => {
      res(ctx.status(500))
    }),

    rest.get('http://localhost:3030/toppings', (req, res, ctx) => {
      res(ctx.status(500))
    })
  )

  render(<OrderEntry />)

  await waitFor(async () => {
    const alert = await screen.findAllByRole('alert')
    expect(alert).toHaveLength(2)
  })
})

describe('Grand total', () => {
  test('grand total updates properly if scoop is added first', async () => {
    // total starts out as 0.00
    render(<OrderEntry />)
    const grandTotal = screen.getByRole('heading', {
      name: /Grand total: \$/
    })
    expect(grandTotal).toHaveTextContent('0.00')

    // Update Vanilla input to 2 and check the grandtotal
    const vanillaInput = await screen.findByRole('spinbutton', {
      name: 'Vanilla'
    })

    userEvent.clear(vanillaInput)
    userEvent.type(vanillaInput, '2')
    expect(grandTotal).toHaveTextContent('4.00')

    // add Cherries and check Grandtotal
    const cherriesCheckbox = await screen.findByRole('checkbox', {
      name: 'Cherries'
    })
    userEvent.click(cherriesCheckbox)
    expect(grandTotal).toHaveTextContent('5.50')
  })

  test('grand total updates properly if topping is added first', async () => {
    render(<OrderEntry />)
    const grandTotal = screen.getByRole('heading', {
      name: /Grand total: \$/i
    })

    expect(grandTotal).toHaveTextContent('0.00')

    // add cherries and check the grandtotal
    const cherriesCheckbox = await screen.findByRole('checkbox', { 
      name: 'Cherries'
    })
    userEvent.click(cherriesCheckbox)
    expect(grandTotal).toHaveTextContent('1.50')

    // add 2 vanilla scoops and check the grandtotal
    const vanillaInput = await screen.findByRole('spinbutton', {
      name: 'Vanilla'
    })

    userEvent.clear(vanillaInput)
    userEvent.type(vanillaInput, '2')
    expect(grandTotal).toHaveTextContent('5.50')
  })

  test('grand total updates properly if item is remove', async () => {
    render(<OrderEntry setOrderPhase={jest.fn()} />)
    const grandTotal = screen.getByRole('heading', {
      name: /Grand total: \$/i
    })

    expect(grandTotal).toHaveTextContent('0.00')
    const vanillaInput = await screen.findByRole('spinbutton', {
      name: 'Vanilla'
    })
    const cherriesCheckbox = await screen.findByRole('checkbox', {
      name: 'Cherries'
    })

    userEvent.clear(vanillaInput)
    userEvent.type(vanillaInput, '2')
    // grand total is 4.00

    userEvent.click(cherriesCheckbox)
    expect(grandTotal).toHaveTextContent('5.50')

    userEvent.clear(vanillaInput)
    userEvent.type(vanillaInput, '1')
    expect(grandTotal).toHaveTextContent('3.50')

    userEvent.click(cherriesCheckbox)
    expect(grandTotal).toHaveTextContent('2.00')
  })
})

test('button is disabled when has no scoops and enabled when has a scoop', async () => {
  render(<OrderEntry />)

  const button = screen.getByRole('button', {
    name: /order sundae/i
  })

  expect(button).toBeDisabled()

  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla'
  })

  // Add a scoop and has subtotal of 2.00
  userEvent.clear(vanillaInput)
  userEvent.type(vanillaInput, '1')
  expect(button).toBeEnabled()

  userEvent.clear(vanillaInput)
  userEvent.type(vanillaInput, '0')
  expect(button).toBeDisabled()
})
