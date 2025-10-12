import { AppBar, Avatar, Box, Container, Divider, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

export function AppLayout({ children }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }} component={RouterLink} to="/tasks">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }} component={RouterLink} to="/tasks" color="inherit" style={{ textDecoration: 'none' }}>
            TaskMaster
          </Typography>
          {!!user && (
            <>
              <Tooltip title={user.fullname || user.username}>
                <IconButton onClick={handleOpen} size="small" sx={{ ml: 2 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>{(user.fullname || user.username || '?').charAt(0).toUpperCase()}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
                <MenuItem component={RouterLink} to="/profile">
                  <Avatar /> Profile
                </MenuItem>
                <MenuItem component={RouterLink} to="/email-config">
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Email Config
                </MenuItem>
                {user.role === 'admin' && (
                  <MenuItem component={RouterLink} to="/admin">
                    <ListItemIcon>
                      <AdminPanelSettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Admin
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={async () => { await logout(); navigate('/login'); }}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}
