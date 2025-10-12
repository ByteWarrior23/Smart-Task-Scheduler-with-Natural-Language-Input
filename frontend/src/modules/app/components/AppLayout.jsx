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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', backgroundImage: 'radial-gradient( 40rem 20rem at -10% -10%, rgba(14,165,233,0.06), transparent ), radial-gradient( 40rem 20rem at 110% -10%, rgba(56,189,248,0.06), transparent )' }}>
      <AppBar position="sticky" elevation={0} sx={{
        background: 'linear-gradient(90deg, #0369a1 0%, #0ea5e9 100%)',
        color: 'white',
        borderBottom: '1px solid rgba(255,255,255,0.12)'
      }}>
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
