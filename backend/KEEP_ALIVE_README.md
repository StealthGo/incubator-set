# Keep-Alive Service for Render Deployment

This setup ensures your FastAPI backend stays awake on Render's free tier, which puts services to sleep after 15 minutes of inactivity.

## 🔧 Setup Instructions

### 1. Environment Variables on Render

Set these environment variables in your Render dashboard:

```bash
RENDER_SERVICE_URL=https://your-app-name.onrender.com
RENDER=true
```

### 2. Built-in Self-Ping (Already Implemented)

The FastAPI app now includes:
- **Health Check Endpoint**: `GET /api/health`
- **Background Task**: Automatically pings itself every 14 minutes
- **Smart Detection**: Only runs on Render (detected by environment variables)

### 3. External Keep-Alive Options

#### Option A: Use a Free Cron Service
1. Sign up for [cron-job.org](https://cron-job.org) or similar
2. Create a cron job that hits your health endpoint every 14 minutes:
   ```
   URL: https://your-app-name.onrender.com/api/health
   Interval: */14 * * * * (every 14 minutes)
   ```

#### Option B: Use GitHub Actions (Free)
Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Alive
on:
  schedule:
    - cron: '*/14 * * * *'  # Every 14 minutes
  workflow_dispatch:  # Manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Server
        run: |
          curl -f https://your-app-name.onrender.com/api/health || exit 1
```

#### Option C: Run External Script
Use the provided `keep_alive.py` script on any server:

```bash
# Set your server URL
export SERVER_URL=https://your-app-name.onrender.com

# Run the keep-alive service
python keep_alive.py
```

## 🚀 How It Works

1. **Self-Ping**: The FastAPI app pings itself every 14 minutes
2. **Health Check**: The `/api/health` endpoint returns server status
3. **Smart Activation**: Only runs on Render, not in development
4. **Backup Options**: External services can also ping the health endpoint

## 🔍 Monitoring

Check your Render logs to see:
```
Keep-alive task started for Render deployment
Keep-alive ping successful: 200
```

## 📝 Notes

- The self-ping runs every 14 minutes (before Render's 15-minute timeout)
- Health endpoint is lightweight and doesn't consume much resources
- Multiple keep-alive methods can run simultaneously for redundancy
- Remember to replace `your-app-name` with your actual Render service name

## 🛠️ Troubleshooting

If the service still goes to sleep:
1. Check Render logs for ping success messages
2. Verify environment variables are set correctly
3. Test the health endpoint manually: `curl https://your-app-name.onrender.com/api/health`
4. Consider using an external backup ping service
