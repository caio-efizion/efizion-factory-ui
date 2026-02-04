import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfirmDialog } from '../ConfirmDialog';

describe('ConfirmDialog', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render dialog with title and message', () => {
    render(
      <ConfirmDialog
        open={true}
        title="Test Title"
        message="Test Message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmDialog
        open={true}
        title="Confirm"
        message="Are you sure?"
        confirmText="Yes"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Yes/i }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <ConfirmDialog
        open={true}
        title="Confirm"
        message="Are you sure?"
        cancelText="No"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /No/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should show warning icon when showWarningIcon is true', () => {
    render(
      <ConfirmDialog
        open={true}
        title="Warning"
        message="This is dangerous"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        showWarningIcon
      />
    );

    // Warning icon should be present
    expect(document.querySelector('[data-testid="WarningAmberIcon"]')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    const { container } = render(
      <ConfirmDialog
        open={false}
        title="Hidden"
        message="Should not see this"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(container.querySelector('[role="dialog"]')).not.toBeVisible();
  });

  it('should have proper accessibility attributes', () => {
    render(
      <ConfirmDialog
        open={true}
        title="Accessible Dialog"
        message="Accessible message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'confirm-dialog-title');
    expect(screen.getByRole('dialog')).toHaveAttribute(
      'aria-describedby',
      'confirm-dialog-description'
    );
  });
});
