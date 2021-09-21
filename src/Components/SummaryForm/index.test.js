import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SummaryForm } from '.'

test('Initial conditions', () => {
  render(<SummaryForm />)
  const checkbox = screen.getByRole('checkbox', {
    name: /terms and conditions/i
  })

  expect(checkbox).not.toBeChecked()

  const confirmButton = screen.getByRole('button', {
    name: /confirm order/i
  })

  expect(confirmButton).toBeDisabled()
})

test('toggle checkbox to disable and enable button', () => {
  render(<SummaryForm />)
  const checkbox = screen.getByRole('checkbox', {
    name: /terms and conditions/i
  })

  const confirmButton = screen.getByRole('button', {
    name: /confirm order/i
  })

  userEvent.click(checkbox)
  expect(confirmButton).toBeEnabled()

  userEvent.click(checkbox)
  expect(confirmButton).toBeDisabled()
})

test('popover responds to hover', async () => {
  render(<SummaryForm />)
  // Popover starts out hidden
  const nullPopover = screen.queryByText(/no ice cream will actually be delivered./i)
  expect(nullPopover).not.toBeInTheDocument()

  // Popover appears upon mouseover of checkbox label
  const termsAndConditions = screen.getByText(/terms and conditions/i)
  userEvent.hover(termsAndConditions)

  const popover = screen.getByText(/no ice cream will actually be delivered./i)
  expect(popover).toBeInTheDocument()
  // Popover disappear when we mouse out
  userEvent.unhover(termsAndConditions)
  await waitForElementToBeRemoved(() =>
    screen.queryByText(/no ice cream will actually be delivered./i)
  )
})
