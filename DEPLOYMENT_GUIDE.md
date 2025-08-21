# Fahmie Farhan Music - Deployment Guide

This guide will walk you through the process of deploying your music portfolio website from local development to a live Hostinger server.

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Version Control with Git](#version-control-with-git)
3. [Preparing for Production](#preparing-for-production)
4. [Deploying to Hostinger](#deploying-to-hostinger)
5. [Common Issues & Troubleshooting](#common-issues--troubleshooting)

## Local Development Setup

### Prerequisites
Ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- Git
- VS Code or preferred code editor

### Local Development Steps

1. **Clone the repository (if not already done)**
   ```bash
   git clone <your-repository-url>
   cd fahmie-farhan-music
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database (if using)
   DATABASE_URL="your-database-url"
   
   # API Keys (if using external services)
   NEXT_PUBLIC_API_KEY="your-api-key"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Test the application locally**
   - Open http://localhost:3000
   - Test all pages and functionality
   - Test the piano audio
   - Test admin panel (login with any credentials)
   - Test blog functionality
   - Test contact forms

### Building for Production

1. **Build the application**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Test the production build locally**
   ```bash
   npm start
   # or
   yarn start
   ```

## Version Control with Git

### Initial Git Setup

If you haven't already initialized Git:

1. **Initialize Git repository**
   ```bash
   git init
   ```

2. **Create .gitignore file**
   Create a `.gitignore` file in the root:
   ```
   # dependencies
   /node_modules
   /.pnp
   .pnp.js

   # testing
   /coverage

   # next.js
   /.next/
   /out/

   # production
   /build

   # misc
   .DS_Store
   *.pem

   # debug
   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*

   # local env files
   .env*.local

   # vercel
   .vercel

   # typescript
   *.tsbuildinfo
   next-env.d.ts
   ```

### Git Workflow

1. **Add files to staging**
   ```bash
   git add .
   ```

2. **Commit changes**
   ```bash
   git commit -m "feat: add initial portfolio website structure"
   ```

3. **Create remote repository**
   - Go to GitHub, GitLab, or your preferred Git hosting
   - Create a new repository
   - Copy the repository URL

4. **Link local repository to remote**
   ```bash
   git remote add origin <your-repository-url>
   ```

5. **Push to remote repository**
   ```bash
   git push -u origin main
   # or
   git push -u origin master
   ```

### Branching Strategy

1. **Create development branch**
   ```bash
   git checkout -b develop
   ```

2. **Create feature branches**
   ```bash
   git checkout -b feature/add-new-blog-post
   ```

3. **Merge feature branches**
   ```bash
   git checkout develop
   git merge feature/add-new-blog-post
   git push origin develop
   ```

4. **Deploy to production**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

## Preparing for Production

### Environment Variables

1. **Create production .env file**
   On Hostinger, you'll need to set these environment variables:
   ```env
   # Database (if using)
   DATABASE_URL="your-production-database-url"
   
   # API Keys (if using)
   NEXT_PUBLIC_API_KEY="your-production-api-key"
   
   # Admin credentials (if using)
   ADMIN_EMAIL="your-admin-email"
   ```

### Optimize Performance

1. **Image optimization**
   - Compress all images before uploading
   - Use WebP format when possible
   - Implement lazy loading

2. **Code splitting**
   - Next.js automatically handles code splitting
   - Ensure dynamic imports for large components

3. **Bundle analysis**
   ```bash
   npm install @next/bundle-analyzer
   npx analyze-bundle
   ```

### Security Considerations

1. **Remove development dependencies**
   ```bash
   npm prune --production
   ```

2. **Set proper CORS headers**
   - Configure in `next.config.js` if needed

3. **Enable HTTPS**
   - Hostinger provides free SSL certificates

## Deploying to Hostinger

### Method 1: Hostinger Website Builder (Recommended)

1. **Log in to Hostinger**
   - Go to hPanel
   - Navigate to Websites

2. **Create a new website**
   - Click "Create New Website"
   - Choose "Install WordPress" (for now, we'll replace it)
   - Complete the setup

3. **Access File Manager**
   - Go to hPanel → Websites → Manage → File Manager
   - Delete the WordPress files (keep the folder structure)

4. **Upload your Next.js build**

   **Option A: Using File Manager**
   - Build your project locally: `npm run build`
   - Zip the `.next` folder, `public` folder, and `package.json`
   - Upload and extract in File Manager

   **Option B: Using SSH (Recommended)**
   ```bash
   # Enable SSH in Hostinger hPanel
   # Connect via SSH
   ssh username@your-hostinger-server
   
   # Navigate to website root
   cd public_html/your-domain
   
   # Upload files using rsync or scp
   rsync -avz --exclude='node_modules' --exclude='.git' ./ user@host:/path/to/public_html/
   ```

5. **Install Node.js on Hostinger**
   - Hostinger supports Node.js
   - In hPanel, go to Websites → Manage → Node.js
   - Select your Node.js version (18+ recommended)

6. **Set up the application**
   - Set the application root to your website directory
   - Set the startup file to `server.js` or create one:
   ```javascript
   // server.js
   const { createServer } = require('http')
   const { parse } = require('url')
   const next = require('next')

   const dev = process.env.NODE_ENV !== 'production'
   const hostname = 'localhost'
   const port = process.env.PORT || 3000

   const app = next({ dev, hostname, port })
   const handle = app.getRequestHandler()

   createServer(async (req, res) => {
     try {
       const parsedUrl = parse(req.url, true)
       await handle(req, res, parsedUrl)
     } catch (err) {
       console.error('Error occurred handling', req.url, err)
       res.statusCode = 500
       res.end('internal server error')
     }
   })
     .once('error', (err) => {
       console.error(err)
       process.exit(1)
     })
     .listen(port, () => {
       console.log(`> Ready on http://${hostname}:${port}`)
     })
   ```

7. **Install dependencies**
   ```bash
   npm install --production
   ```

8. **Set environment variables**
   - In hPanel, go to Websites → Manage → Variables
   - Add your production environment variables

9. **Start the application**
   - Use the "Run" button in Hostinger Node.js section
   - Or restart the Node.js service

### Method 2: Using Vercel (Easier Alternative)

1. **Push to GitHub/GitLab**
   - Ensure your code is in a Git repository
   - Push to GitHub/GitLab

2. **Deploy to Vercel**
   - Sign up at vercel.com
   - Import your repository
   - Configure environment variables
   - Deploy automatically

3. **Custom Domain**
   - Add your custom domain in Vercel
   - Update DNS settings in Hostinger to point to Vercel

### Method 3: Using Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .
   RUN npm run build

   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and run Docker image**
   ```bash
   docker build -t fahmie-farhan-music .
   docker run -p 3000:3000 fahmie-farhan-music
   ```

## Common Issues & Troubleshooting

### Build Issues

**Problem: Build fails on Hostinger**
```bash
# Solution: Check Node.js version
node --version
# Ensure it's 18+
```

**Problem: Missing dependencies**
```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install
```

### Runtime Issues

**Problem: White screen or 404 errors**
- Check if all files were uploaded correctly
- Verify the startup file configuration
- Check Hostinger error logs

**Problem: Environment variables not working**
- Ensure variables are set in Hostinger control panel
- Restart the Node.js application after changing variables
- Check variable names for typos

### Performance Issues

**Problem: Slow loading times**
- Enable gzip compression
- Optimize images
- Use CDN for static assets

**Problem: Audio not working**
- Check if audio files are properly uploaded
- Verify file paths
- Test in different browsers

### Domain and SSL Issues

**Problem: Domain not pointing**
- Verify DNS settings
- Wait 24-48 hours for DNS propagation
- Check Hostinger domain configuration

**Problem: SSL certificate issues**
- Request free SSL certificate in Hostinger
- Force HTTPS redirect
- Clear browser cache

### Maintenance Tips

1. **Regular backups**
   - Hostinger provides automatic backups
   - Keep local copies of your code

2. **Monitor performance**
   - Use Hostinger analytics
   - Monitor uptime and response times

3. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

4. **Security updates**
   - Regularly update Node.js version
   - Monitor for security vulnerabilities

## Support Resources

- **Hostinger Documentation**: https://www.hostinger.com/tutorials
- **Next.js Documentation**: https://nextjs.org/docs
- **Git Documentation**: https://git-scm.com/doc
- **Community Support**: Hostinger 24/7 live chat

## Final Checklist

Before going live:

- [ ] All pages work correctly
- [ ] Piano audio functions properly
- [ ] Admin panel is accessible
- [ ] Blog functionality works
- [ ] Contact forms submit correctly
- [ ] Images are optimized
- [ ] SSL certificate is active
- [ ] Domain is properly configured
- [ ] Mobile responsiveness is tested
- [ ] Performance is optimized
- [ ] Backup is created

---

This guide covers the complete deployment process. If you encounter any issues specific to your setup, please refer to the Hostinger documentation or contact their support team.