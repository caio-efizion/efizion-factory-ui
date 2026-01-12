
import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';

export default function Main({ children }: { children: ReactNode }) {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '240px' }}>
      {children}
    </Box>
  );
}
