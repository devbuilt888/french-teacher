# Super French Teacher - CPanel Deployment Guide

This guide will walk you through the process of building and deploying your Super French Teacher React application to a CPanel hosting environment.

## 1. Build the Production Version

First, create an optimized production build of your application:

```bash
# Make sure you're in the project directory
cd /path/to/super-french-teacher

# Install dependencies (if you haven't already)
npm install

# Create a production build
npm run build
```

This will create a `build` folder containing optimized static files ready for deployment.

## 2. Prepare Your CPanel Account

Before uploading your files, make sure you have:

1. Access to your CPanel account
2. FTP credentials or File Manager access
3. A domain or subdomain where you want to deploy the app

## 3. Uploading Files to CPanel

### Option 1: Using File Manager in CPanel

1. Log in to your CPanel account
2. Open the File Manager
3. Navigate to the public directory where you want to deploy your app:
   - For the main domain: `public_html/`
   - For a subdomain: `public_html/subdomain/`
4. Upload the entire contents of your `build` folder to this directory
   
### Option 2: Using FTP

1. Use an FTP client like FileZilla, WinSCP, or Cyberduck
2. Connect to your server using your FTP credentials
3. Navigate to the public directory (as mentioned above)
4. Upload the entire contents of your `build` folder to this directory

## 4. Configure CPanel for React Router

Your app uses React Router, which requires server-side configuration to handle client-side routing. The `.htaccess` file in your build folder already contains the necessary configuration, but make sure it's properly uploaded:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

This ensures that all routes are directed to your index.html, allowing React Router to handle routing on the client side.

## 5. Special Considerations for 3D Models

Your application uses large 3D models (GLB files). Make sure:

1. All model files in the `public/models/` directory are properly uploaded to the corresponding location on your server
2. The models folder contains all required files:
   - croissant.glb
   - bread.glb
   - champagne.glb
   - tower.glb
   - chicken.glb

## 6. Post-Deployment Check

After deployment, verify that:

1. Your application loads correctly at your domain/subdomain
2. The 3D scene renders properly
3. All routes work (e.g., navigate from landing page to chat)
4. All models load and can be interacted with

## 7. Common Issues and Troubleshooting

### Missing Models

If 3D models aren't appearing:
- Check browser console for 404 errors
- Verify that model files were uploaded to the correct location
- Make sure file permissions are correct (typically 644)

### Routing Issues

If routes like `/chat` show a 404 error:
- Make sure the `.htaccess` file was properly uploaded
- Check that mod_rewrite is enabled on your server
- Contact your hosting provider to ensure Apache is configured to use .htaccess files

### Performance Issues

If the 3D scene performs poorly:
- Consider optimizing your 3D models (reduce polygons, compress textures)
- Adjust the Canvas DPR setting in FrenchModelScene.js (currently set to [1, 1.5])

## 8. Updating Your Deployment

When you need to update your application:
1. Make your changes locally
2. Run `npm run build` again
3. Upload the new build files, replacing the old ones

## 9. Environment Variables (if needed)

If your app uses environment variables (like API keys):
1. Create a `.env` file locally with your production values
2. Rebuild the app with `npm run build`
3. The values will be embedded in the JavaScript bundle

For better security, consider implementing server-side proxying for sensitive API requests.

## Need Help?

If you encounter any issues with your deployment, please refer to your hosting provider's documentation or contact their support. 