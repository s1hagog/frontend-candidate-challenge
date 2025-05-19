import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '../../utils/test-utils'
import Popup from '../Popup'

const MockChildren = () => <div>Children</div>
const mockOnClose = jest.fn()

describe('test Popup.tsx', () => {
  it('renders', () => {
    renderWithProviders(
      <Popup onClose={mockOnClose}>
        <MockChildren />
      </Popup>,
    )

    expect(screen.getByText('Children')).toBeInTheDocument()
    expect(screen.getByLabelText('Close')).toBeInTheDocument()
  })

  it('calls close function', () => {
    renderWithProviders(
      <Popup onClose={mockOnClose}>
        <MockChildren />
      </Popup>,
    )

    fireEvent.click(screen.getByLabelText('Close'))
    expect(mockOnClose).toHaveBeenCalled()
  })
})
