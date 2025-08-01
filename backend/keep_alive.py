#!/usr/bin/env python3
"""
External Keep-Alive Service for Render Deployment
This script can be run on a separate service or cron job to ping your FastAPI server
"""

import asyncio
import httpx
import os
from datetime import datetime

# Configuration
SERVER_URL = os.getenv("SERVER_URL", "https://your-app-name.onrender.com")  # Replace with your actual Render URL
PING_INTERVAL = 14 * 60  # 14 minutes
HEALTH_ENDPOINT = "/api/health"

async def ping_server():
    """Ping the server to keep it awake"""
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(f"{SERVER_URL}{HEALTH_ENDPOINT}")
            if response.status_code == 200:
                print(f"✅ [{datetime.now()}] Server ping successful: {response.status_code}")
                return True
            else:
                print(f"⚠️ [{datetime.now()}] Server ping returned: {response.status_code}")
                return False
    except Exception as e:
        print(f"❌ [{datetime.now()}] Server ping failed: {e}")
        return False

async def keep_alive_service():
    """Main keep-alive service loop"""
    print(f"🚀 Starting keep-alive service for {SERVER_URL}")
    print(f"📅 Ping interval: {PING_INTERVAL} seconds ({PING_INTERVAL/60} minutes)")
    
    while True:
        await ping_server()
        await asyncio.sleep(PING_INTERVAL)

if __name__ == "__main__":
    try:
        asyncio.run(keep_alive_service())
    except KeyboardInterrupt:
        print("\n🛑 Keep-alive service stopped by user")
    except Exception as e:
        print(f"💥 Keep-alive service crashed: {e}")
