import { Box, Card, CardContent, Grid, Typography, LinearProgress, Chip, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';
import { motion } from 'framer-motion';
import TaskIcon from '@mui/icons-material/Task';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export function DashboardPage() {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get('/api/v1/tasks').then(res => res.data.data),
  });

  const { data: stats } = useQuery({
    queryKey: ['reminder-stats'],
    queryFn: () => api.get('/api/v1/tasks/reminders/stats').then(res => res.data),
  });

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const urgentTasks = tasks.filter(t => t.priority === 'urgent').length;

  const recentTasks = tasks.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4, className: 'neon-text' }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="gradient-card glass" sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TaskIcon sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white' }}>{tasks.length}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Total Tasks</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, #66bb6a, #388e3c)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white' }}>{completedTasks}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Completed</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ffa726, #fb8c00)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ScheduleIcon sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white' }}>{pendingTasks}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Pending</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white' }}>{urgentTasks}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Urgent</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="gradient-card glass">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>Task Completion Progress</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {completedTasks} of {tasks.length} tasks completed
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5, 
                      mt: 1,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#66bb6a'
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="gradient-card glass">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>Recent Tasks</Typography>
                <List>
                  {recentTasks.map((task, index) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ListItem sx={{ 
                        background: 'rgba(255,255,255,0.1)', 
                        borderRadius: 2, 
                        mb: 1,
                        '&:hover': { background: 'rgba(255,255,255,0.2)' }
                      }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: task.priority === 'urgent' ? '#ff6b6b' : task.priority === 'high' ? '#ffa726' : '#66bb6a' }}>
                            <TaskIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={task.title}
                          primaryTypographyProps={{ sx: { color: 'white', fontWeight: 500 } }}
                          secondary={
                            <Box>
                              <Chip
                                size="small"
                                label={task.status}
                                color={task.status === 'completed' ? 'success' : 'default'}
                                sx={{ 
                                  mr: 1, 
                                  bgcolor: task.status === 'completed' ? 'rgba(76,175,80,0.8)' : 'rgba(255,255,255,0.2)',
                                  color: 'white'
                                }}
                              />
                              <Chip
                                size="small"
                                label={task.priority}
                                sx={{ 
                                  bgcolor: task.priority === 'urgent' ? 'rgba(255,107,107,0.8)' : 
                                         task.priority === 'high' ? 'rgba(255,167,38,0.8)' : 
                                         'rgba(102,187,106,0.8)',
                                  color: 'white'
                                }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
}
