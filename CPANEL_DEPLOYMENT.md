# Super French Tutor - cPanel Deployment Guide

This guide provides step-by-step instructions for deploying the Super French Tutor application to a cPanel hosting account using FileZilla.

## Prerequisites

1. A cPanel hosting account
2. FileZilla FTP client installed on your computer
3. The built React application (the contents of the `build` directory)

## Deployment Steps

### 1. Connect to Your cPanel Server with FileZilla

1. Open FileZilla
2. Enter your cPanel FTP credentials:
   - Host: Your FTP hostname (typically `ftp.yourdomain.com`)
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21 (default FTP port)
3. Click "Quick Connect" to establish a connection

### 2. Navigate to the Target Directory

1. In the right panel (server side), navigate to the `public_html` directory or a subdirectory where you want to host the application
2. If you're deploying to a subdomain or addon domain, navigate to its document root

### 3. Upload the Build Files

1. In the left panel (local side), navigate to the `build` directory of your project
2. Select all files and folders inside the `build` directory
3. Drag the selected files to the right panel (server side)
4. Wait for the upload to complete

### 4. Configure cPanel Settings (if needed)

If your application uses React Router, ensure:

1. The `.htaccess` file was properly uploaded
2. Mod_rewrite is enabled in your cPanel (through the "Apache Modules" option)

### 5. Test Your Deployment

1. Visit your website URL in a browser
2. Test all the app features, especially voice recognition which requires HTTPS
3. If you encounter issues, check the browser console for errors

## Troubleshooting

- If you have routing issues, verify the `.htaccess` file was uploaded correctly
- If API calls fail, ensure your OpenAI API key is properly configured
- For voice recording issues, ensure your site is using HTTPS

## Security Note

This deployment includes your OpenAI API key directly in the client-side code. For a more secure production setup, consider creating a backend API that handles OpenAI requests 