# FileZilla Upload Guide for Super French Tutor

This guide provides detailed instructions for uploading your Super French Tutor application to a cPanel server using FileZilla.

## Step 1: Install FileZilla

If you don't have FileZilla installed, you can download it from [the official website](https://filezilla-project.org/download.php).

## Step 2: Gather Your FTP Credentials

Before connecting, you'll need:
- Host: Your FTP hostname (typically `ftp.yourdomain.com`)
- Username: Your cPanel username
- Password: Your cPanel password
- Port: 21 (default FTP port)

These credentials are typically available in your cPanel account or from your hosting provider.

## Step 3: Connect to Your Server

1. Open FileZilla
2. Enter your FTP credentials in the quick connect bar at the top:
   ![FileZilla Quick Connect](https://example.com/filezilla-connect.jpg)
3. Click "Quick Connect"
4. Accept any SSL/TLS certificate warnings if they appear

## Step 4: Navigate to the Target Directory

On the right-side panel (remote site):

1. Navigate to the `public_html` directory
   - This is typically the root directory for your main domain
2. If you're using a subdomain or want to place the app in a subdirectory:
   - For a subdomain: navigate to the subdomain's document root
   - For a subdirectory: navigate to `public_html` and create a new directory

## Step 5: Upload Files

1. On the left-side panel (local site):
   - Navigate to the `build` folder in your project directory
   - Select all files and folders inside the `build` directory (Ctrl+A)

2. Drag and drop the selected files to the right panel, or right-click and select "Upload"
   - You should see the transfer queue at the bottom showing progress

3. Wait for all files to upload completely before proceeding

## Step 6: Verify File Permissions

Most files should have permissions set to 644 (readable by all, writable by owner). Folders should be 755 (readable and executable by all, writable by owner).

To check/change permissions:
1. Right-click on a file or folder in the remote panel
2. Select "File permissions..."
3. Set numeric value to 644 for files or 755 for directories
4. Apply recursively for directories if needed

## Step 7: Test Your Site

1. Open a web browser and navigate to your domain
2. Verify all features work correctly:
   - Page navigation
   - Voice recognition (requires HTTPS)
   - Text-to-speech functionality
   - OpenAI integration

## Troubleshooting Common Issues

### 403 Forbidden or 404 Not Found Errors
- Check that the `.htaccess` file was uploaded correctly
- Ensure mod_rewrite is enabled in your cPanel

### Voice Recognition Not Working
- Ensure your site is using HTTPS (voice recognition requires a secure context)
- Test in Chrome or Edge as they have the best support for Web Speech API

### API Calls Failing
- Check browser console for error messages
- Verify your OpenAI API key is configured correctly

## Additional Tips

- Use the "View/Edit" function in FileZilla to quickly edit text files on the server
- Enable "Preserve timestamps" in the transfer settings for better version control
- Consider setting up automatic synchronization for future updates

For more detailed help with FileZilla, refer to the [official documentation](https://wiki.filezilla-project.org/Main_Page). 