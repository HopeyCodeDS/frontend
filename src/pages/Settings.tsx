import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Storage as StorageIcon
} from '@mui/icons-material';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    warehouseAlerts: true,
    truckUpdates: true,
    appointmentReminders: true
  });

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC+1');

  const handleNotificationChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications(prev => ({
      ...prev,
      [key]: event.target.checked
    }));
  };

  const handleSave = () => {
    // Save settings logic
    console.log('Saving settings...');
  };

  const handleReset = () => {
    // Reset settings logic
    console.log('Resetting settings...');
  };

    return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure your system preferences and account settings
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Notifications Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <NotificationsIcon />
                </Avatar>
              }
              title="Notification Preferences"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Notifications" 
                    secondary="Receive updates via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.email}
                      onChange={handleNotificationChange('email')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Push Notifications" 
                    secondary="Receive browser push notifications"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.push}
                      onChange={handleNotificationChange('push')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="SMS Notifications" 
                    secondary="Receive updates via SMS"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.sms}
                      onChange={handleNotificationChange('sms')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Warehouse Alerts" 
                    secondary="Get notified about capacity issues"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.warehouseAlerts}
                      onChange={handleNotificationChange('warehouseAlerts')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Truck Updates" 
                    secondary="Receive truck status updates"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.truckUpdates}
                      onChange={handleNotificationChange('truckUpdates')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Appointment Reminders" 
                    secondary="Get reminded about upcoming appointments"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.appointmentReminders}
                      onChange={handleNotificationChange('appointmentReminders')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Appearance & Language */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <PaletteIcon />
                </Avatar>
              }
              title="Appearance & Language"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={theme}
                    label="Theme"
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto (System)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={language}
                    label="Language"
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="nl">Nederlands</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={timezone}
                    label="Timezone"
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <MenuItem value="UTC+0">UTC+0 (London)</MenuItem>
                    <MenuItem value="UTC+1">UTC+1 (Brussels)</MenuItem>
                    <MenuItem value="UTC+2">UTC+2 (Eastern Europe)</MenuItem>
                    <MenuItem value="UTC-5">UTC-5 (Eastern US)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
                    </CardContent>
                </Card>
        </Grid>

        {/* Account Information */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <PersonIcon />
                </Avatar>
              }
              title="Account Information"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    defaultValue="John Doe"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue="john.doe@kdg.com"
                    variant="outlined"
                    type="email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    defaultValue="+32 123 456 789"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    defaultValue="Logistics"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Role"
                    defaultValue="Logistics Manager"
                    variant="outlined"
                    disabled
                  />
                </Grid>
              </Grid>
                    </CardContent>
                </Card>
        </Grid>

        {/* System Information */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <SettingsIcon />
                </Avatar>
              }
              title="System Information"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Version
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      1.0.0
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Build Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Environment
                    </Typography>
                    <Chip label="Production" color="success" size="small" />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Database
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      PostgreSQL 14
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
                    </CardContent>
                </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleReset}
                >
                  Reset to Defaults
                                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Save Changes
                                </Button>
              </Box>
                    </CardContent>
                </Card>
        </Grid>
      </Grid>
    </Box>
    );
}