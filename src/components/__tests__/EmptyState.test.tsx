import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';
import userEvent from '@testing-library/user-event';

describe('EmptyState', () => {
  it('should render title and description', () => {
    render(
      <EmptyState
        title="No items found"
        description="Try creating your first item"
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try creating your first item')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    const mockAction = jest.fn();
    
    render(
      <EmptyState
        title="Empty"
        actionLabel="Create Item"
        onAction={mockAction}
      />
    );

    expect(screen.getByRole('button', { name: /Create Item/i })).toBeInTheDocument();
  });

  it('should call onAction when button is clicked', async () => {
    const user = userEvent.setup();
    const mockAction = jest.fn();
    
    render(
      <EmptyState
        title="Empty"
        actionLabel="Create"
        onAction={mockAction}
      />
    );

    await user.click(screen.getByRole('button', { name: /Create/i }));
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should not render action button when not provided', () => {
    render(<EmptyState title="Empty" />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render custom icon', () => {
    const CustomIcon = () => <div data-testid="custom-icon">Custom</div>;
    
    render(
      <EmptyState
        title="Empty"
        icon={<CustomIcon />}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    const { container } = render(<EmptyState title="Empty" />);
    
    const emptyStateContainer = container.firstChild;
    expect(emptyStateContainer).toHaveAttribute('role', 'status');
    expect(emptyStateContainer).toHaveAttribute('aria-live', 'polite');
  });
});
