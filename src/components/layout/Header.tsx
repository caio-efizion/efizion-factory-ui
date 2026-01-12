
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Header() {
  return (
    <AppBar position="static" color="primary" sx={{ bgcolor: '#212121' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="Abrir menu de navegação" sx={{ mr: 2 }} tabIndex={0}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#fff' }} tabIndex={0} aria-label="Título do painel Efizion Factory UI">
          Efizion Factory UI
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
