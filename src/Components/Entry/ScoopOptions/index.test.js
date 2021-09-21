import userEvent from '@testing-library/user-event'
import { render, screen } from '../../../test-utils'
import { ScoopOptions } from '.'

test('scoop indicate value of non-int or out of range', async () => {
  render(<ScoopOptions name="" imagePath="" updateItemCount={jest.fn()} />)

  const spinButton = screen.getByRole('spinbutton')
  userEvent.clear(spinButton)
  userEvent.type(spinButton, '-1')
  expect(spinButton).toHaveClass('is-invalid')

  userEvent.clear(spinButton)
  userEvent.type(spinButton, '2.5')
  expect(spinButton).toHaveClass('is-invalid')

  userEvent.clear(spinButton)
  userEvent.type(spinButton, '11')
  expect(spinButton).toHaveClass('is-invalid')

  userEvent.clear(spinButton)
  userEvent.type(spinButton, '1')
  expect(spinButton).not.toHaveClass('is-invalid')
})
