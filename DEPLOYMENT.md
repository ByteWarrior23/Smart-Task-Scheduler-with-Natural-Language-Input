# Deployment Guide

## Production Deployment

### Environment Configuration

1. Set `NODE_ENV=production` in backend `.env`
2. Update `FRONTEND_URL` to your production domain
3. Use secure, randomly generated secrets for JWT tokens
4. Enable MongoDB authentication and use secure connection strings

### Backend Deployment

#### Using Docker

```bash
docker build -t taskmaster-backend ./backend
docker run -p 3001:3001 --env-file ./backend/.env taskmaster-backend
```

#### Using PM2

```bash
cd backend
npm install -g pm2
pm2 start src/server.js --name taskmaster-backend
pm2 save
pm2 startup
```

### Frontend Deployment

#### Build for Production

```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/` directory.

#### Deploy to Netlify/Vercel

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-backend-url.com`

#### Deploy to Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/taskmaster/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure JWT secrets
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB authentication
- [ ] Regular security updates

## Performance Optimization

- Enable compression
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries
- Use production builds
- Monitor application performance
