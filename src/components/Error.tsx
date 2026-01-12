import React from 'react';

export const Error: React.FC<{ message: string }> = ({ message }) => <div className="error">{message}</div>;
