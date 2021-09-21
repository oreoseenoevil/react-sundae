import { render, screen } from '../../../test-utils'
import userEvent from '@testing-library/user-event'
import { Options } from '.'

test('displays image for each scoop option from server', async () => {
  render(<Options optionType="scoops" />)

  const scoopImages = await screen.findAllByRole('img', { name: /scoop$/i })

  expect(scoopImages).toHaveLength(2)

  const altText = scoopImages.map(img => img.alt)
  expect(altText).toEqual(['Chocolate scoop', 'Vanilla scoop'])
})

test('dispay image for each topping option form server', async () => {
  render(<Options optionType="toppings" />)
  const toppingImages = await screen.findAllByRole('img', {
    name: /topping$/i
  })

  expect(toppingImages).toHaveLength(3)

  const altText = toppingImages.map(img => img.alt)
  expect(altText).toEqual([
    'Cherries topping',
    'M&Ms topping',
    'Hot fudge topping'
  ])
})

// TotalUpdates
test('update scoop subtotal when scoops change', async () => {
  render(<Options optionType="scoops" />)

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText('Scoops total: $', {
    exact: false
  })
  expect(scoopsSubtotal).toHaveTextContent('0.00')

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla'
  })

  userEvent.clear(vanillaInput)
  userEvent.type(vanillaInput, '1')
  expect(scoopsSubtotal).toHaveTextContent('2.00')

  // update chocolate scoop to 2 and check the subtotal
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate'
  })

  userEvent.clear(chocolateInput)
  userEvent.type(chocolateInput, '2')
  expect(scoopsSubtotal).toHaveTextContent('6.00')
})

test('update toppings subtotal when toppings change', async () => {
  render(<Options optionType="toppings" />)

  // make sure total starts out at 0.00
  const toppingsSubtotal = screen.getByText('Toppings total: $', {
    exact: false
  })

  expect(toppingsSubtotal).toHaveTextContent('0.00')

  // add cherries and check subtotal
  const cherriesCheckbox = await screen.findByRole('checkbox', {
    name: 'Cherries'
  })
  userEvent.click(cherriesCheckbox)
  expect(toppingsSubtotal).toHaveTextContent('1.50')

  // add hot fudge and check subtotal
  const hotFudgeCheckbox = screen.getByRole('checkbox', {
    name: 'Hot fudge'
  })
  userEvent.click(hotFudgeCheckbox)
  expect(toppingsSubtotal).toHaveTextContent('3.00')

  // remove hot fudge and check subtotal
  userEvent.click(hotFudgeCheckbox)
  expect(toppingsSubtotal).toHaveTextContent('1.50')
})

test('doesn\'t update total when have an invalid value', async () => {
  render(<Options optionType="scoops" />)
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla'
  })

  const scoopsSubtotal = screen.getByText('Scoops total: $', {
    exact: false
  })

  expect(scoopsSubtotal).toHaveTextContent('0.00')

  userEvent.clear(vanillaInput)
  userEvent.type(vanillaInput, '1')
  expect(scoopsSubtotal).toHaveTextContent('2.00')

  // add scoop with negative and check subtotal
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate'
  })

  userEvent.clear(chocolateInput)
  userEvent.type(chocolateInput, '-1')
  expect(chocolateInput).toHaveClass('is-invalid')
  // total them same since it has a negative value
  expect(scoopsSubtotal).toHaveTextContent('2.00')

  userEvent.clear(chocolateInput)
  userEvent.type(chocolateInput, '2')
  // chocolate 2 x 2 = 4 and vanilla is 2 total value is 6
  expect(chocolateInput).not.toHaveClass('is-invalid')
  expect(scoopsSubtotal).toHaveTextContent('6.00')
})
