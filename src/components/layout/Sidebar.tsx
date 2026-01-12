import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';

const menuItems = [
  { text: 'Home', icon: <DashboardIcon />, href: '/' },
  { text: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
  { text: 'Tarefas', icon: <AssignmentIcon />, href: '/tasks' },
  { text: 'Configurações', icon: <SettingsIcon />, href: '/settings' },
];

export default function Sidebar() {
  return (
    <Drawer variant="permanent" anchor="left" sx={{ bgcolor: '#212121' }}>
      <List aria-label="Menu de navegação lateral">
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link href={item.href} passHref legacyBehavior={undefined}>
              <Button
                startIcon={item.icon}
                fullWidth
                sx={{ justifyContent: 'flex-start', textTransform: 'none', padding: '16px', color: '#fff', bgcolor: '#212121', '&:focus': { outline: '2px solid #1976d2' } }}
                aria-label={`Ir para ${item.text}`}
                tabIndex={0}
              >
                {item.text}
              </Button>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
