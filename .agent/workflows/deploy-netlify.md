---
description: Deploy frontend to Netlify via GitHub
---

# Deploy AI Interview Platform to Netlify

This workflow guides you through deploying the **frontend** of your AI-Powered Interview Preparation Platform to Netlify using GitHub integration.

## ⚠️ Important Notes

- **Netlify hosts static sites only** - Only the React frontend will be deployed to Netlify
- **Backend services need separate hosting** - Java, Python, and Node.js services require different hosting solutions (see Backend Deployment section)
- **Environment variables** - You'll need to configure API endpoints to point to your hosted backends

## 📋 Prerequisites

1. ✅ GitHub account
2. ✅ Netlify account (free tier works fine)
3. ✅ Your code pushed to a GitHub repository
4. ✅ Backend services deployed elsewhere (or running locally for testing)

---

## 🚀 Step-by-Step Deployment

### Step 1: Push Your Code to GitHub

If you haven't already pushed your code to GitHub:

```bash
# Navigate to project root
cd "c:\Users\parth\OneDrive - MSFT\Documents\1 PROJECTS\WEB DEVELOPMENT\JAVA\AI-Powered_Interview_Preparation_Platform\AI-Powered_Interview_Preparation_Platform"

# Check git status
git status

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Netlify deployment"

# Push to GitHub (replace with your repo URL)
git push origin main
```

### Step 2: Create Netlify Configuration

Create a `netlify.toml` file in your project root to configure the build:

**File:** `netlify.toml` (in project root)
```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 3: Configure Frontend API Endpoints

Create an environment-aware API configuration:

**File:** `frontend/src/config/api.js`
```javascript
const API_CONFIG = {
  development: {
    JAVA_BACKEND: 'http://localhost:8080',
    PYTHON_AI: 'http://localhost:8001',
    NODE_BACKEND: 'http://localhost:3000'
  },
  production: {
    JAVA_BACKEND: import.meta.env.VITE_JAVA_BACKEND_URL || 'https://your-java-backend.com',
    PYTHON_AI: import.meta.env.VITE_PYTHON_AI_URL || 'https://your-python-ai.com',
    NODE_BACKEND: import.meta.env.VITE_NODE_BACKEND_URL || 'https://your-node-backend.com'
  }
};

const ENV = import.meta.env.MODE || 'development';

export const API_ENDPOINTS = API_CONFIG[ENV];
```

### Step 4: Deploy to Netlify via GitHub

#### Option A: Netlify Dashboard (Recommended for First Time)

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Click "Add new site" → "Import an existing project"

2. **Connect to GitHub**
   - Click "GitHub"
   - Authorize Netlify to access your repositories
   - Select your repository: `Paarth1809/interview_platform`

3. **Configure Build Settings**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
   - **Node version:** 18

4. **Add Environment Variables** (if needed)
   - Click "Show advanced"
   - Add environment variables:
     - `VITE_JAVA_BACKEND_URL` = `https://your-java-backend-url.com`
     - `VITE_PYTHON_AI_URL` = `https://your-python-ai-url.com`
     - `VITE_NODE_BACKEND_URL` = `https://your-node-backend-url.com`

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (2-5 minutes)
   - Your site will be live at: `https://random-name-12345.netlify.app`

6. **Custom Domain (Optional)**
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Follow instructions to configure DNS

#### Option B: Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to frontend directory
cd frontend

# Initialize Netlify site
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: interview-platform (or your choice)
# - Build command: npm run build
# - Publish directory: dist

# Deploy
netlify deploy --prod
```

### Step 5: Configure Continuous Deployment

Once connected to GitHub, Netlify automatically:
- ✅ Deploys on every push to `main` branch
- ✅ Creates preview deployments for pull requests
- ✅ Shows build logs and errors

To customize:
1. Go to "Site settings" → "Build & deploy"
2. Configure branch deploys
3. Set up deploy notifications

---

## 🔧 Backend Deployment Options

Since Netlify only hosts static sites, you need to deploy your backends separately:

### Java Spring Boot Backend (Port 8080)

**Recommended Platforms:**
- **Railway** - Easy deployment, free tier available
- **Render** - Free tier with automatic deploys
- **Heroku** - Classic choice (paid)
- **AWS Elastic Beanstalk** - Enterprise option
- **Google Cloud Run** - Serverless containers

**Quick Deploy to Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to Java backend
cd backend/qa-service

# Initialize and deploy
railway init
railway up
```

### Python AI Service (Port 8001)

**Recommended Platforms:**
- **Render** - Great for Python apps
- **Railway** - Easy deployment
- **Google Cloud Run** - Serverless
- **AWS Lambda** - Serverless (requires adaptation)

**Quick Deploy to Render:**
1. Create `render.yaml` in `backend/ai-eval-service/`:
```yaml
services:
  - type: web
    name: ai-eval-service
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Node.js + MongoDB Backend (Port 3000)

**Recommended Platforms:**
- **Render** - Includes free MongoDB
- **Railway** - Easy MongoDB integration
- **Heroku** - With MongoDB Atlas
- **Vercel** - For serverless functions

**MongoDB Hosting:**
- **MongoDB Atlas** - Free tier (512MB)
- **Railway** - Managed MongoDB

---

## 🧪 Testing Your Deployment

### 1. Test Build Locally First

```bash
# Navigate to frontend
cd frontend

# Build for production
npm run build

# Preview the build
npm run preview

# Test at http://localhost:4173
```

### 2. Check Netlify Build Logs

- Go to "Deploys" tab in Netlify dashboard
- Click on latest deploy
- Review build logs for errors

### 3. Test Live Site

- Visit your Netlify URL
- Open browser console (F12)
- Check for CORS errors or API connection issues
- Test interview flow end-to-end

---

## 🐛 Common Issues & Solutions

### Issue: Build Fails on Netlify

**Solution:**
- Check Node version matches (18+)
- Ensure all dependencies are in `package.json`
- Review build logs for specific errors

### Issue: API Calls Fail (CORS Errors)

**Solution:**
Add CORS headers to your backend services:

**Java Backend (Spring Boot):**
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("https://your-netlify-site.netlify.app")
                    .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}
```

**Python Backend (FastAPI):**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-netlify-site.netlify.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Node.js Backend (Express):**
```javascript
const cors = require('cors');
app.use(cors({
    origin: 'https://your-netlify-site.netlify.app'
}));
```

### Issue: Environment Variables Not Working

**Solution:**
- Ensure variables start with `VITE_` prefix
- Add them in Netlify dashboard: Site settings → Environment variables
- Redeploy after adding variables

### Issue: Routes Return 404

**Solution:**
- Ensure `netlify.toml` has the redirect rule (see Step 2)
- This enables client-side routing for React Router

---

## 📊 Deployment Checklist

Before deploying, ensure:

- [ ] Code is pushed to GitHub
- [ ] `netlify.toml` is created in project root
- [ ] Frontend build works locally (`npm run build`)
- [ ] API endpoints are configured for production
- [ ] Backend services are deployed and accessible
- [ ] CORS is configured on all backend services
- [ ] Environment variables are set in Netlify
- [ ] MongoDB is accessible from deployed backends
- [ ] All secrets are in environment variables (not hardcoded)

---

## 🎯 Recommended Full Stack Deployment Strategy

### Option 1: All-in-One Platform (Easiest)

**Use Railway for everything:**
1. Deploy Java backend to Railway
2. Deploy Python AI service to Railway
3. Deploy Node.js backend to Railway
4. Add Railway MongoDB
5. Deploy frontend to Netlify
6. Configure Netlify env vars to point to Railway URLs

### Option 2: Mixed Platform (Cost-Effective)

1. **Frontend** → Netlify (free)
2. **Java Backend** → Render (free tier)
3. **Python AI** → Render (free tier)
4. **Node.js** → Render (free tier)
5. **MongoDB** → MongoDB Atlas (free tier)

### Option 3: Enterprise (Production-Ready)

1. **Frontend** → Netlify or Vercel
2. **All Backends** → AWS ECS or Google Cloud Run
3. **MongoDB** → MongoDB Atlas (paid tier)
4. **Load Balancer** → AWS ALB or Google Cloud Load Balancer

---

## 🔄 Continuous Deployment Workflow

Once set up, your workflow will be:

1. **Make changes locally**
2. **Commit and push to GitHub**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. **Netlify automatically:**
   - Detects the push
   - Runs build command
   - Deploys new version
   - Updates live site (2-5 minutes)

---

## 📚 Additional Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Vite Build Configuration](https://vitejs.dev/guide/build.html)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas)

---

## 🎉 Next Steps After Deployment

1. **Monitor Performance**
   - Use Netlify Analytics
   - Set up error tracking (Sentry)

2. **Set Up Custom Domain**
   - Purchase domain (Namecheap, Google Domains)
   - Configure DNS in Netlify

3. **Enable HTTPS**
   - Automatic with Netlify
   - Free SSL certificate

4. **Set Up Monitoring**
   - Backend health checks
   - Uptime monitoring (UptimeRobot)

5. **Optimize Performance**
   - Enable Netlify CDN
   - Compress images
   - Code splitting

---

**Good luck with your deployment! 🚀**
