import React from 'react';

interface ErrorNotificationProps {
  message: string;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message }) => (
  <div className="error-notification">{message}</div>
);

export default ErrorNotification;
