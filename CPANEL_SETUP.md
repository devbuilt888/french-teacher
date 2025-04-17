# Setting up Super French Teacher on CPanel

This guide walks you through setting up the Super French Teacher application on a CPanel server, including environment variables.

## Prerequisites

1. A CPanel hosting account
2. FTP access to your server or CPanel File Manager access
3. An OpenAI API key

## Deployment Steps

### 1. Build the React Application

First, build the React application with your API key in the environment:

1. Create a `.env.production` file in the project root with your OpenAI API key:
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

2. Run the build command:
   ```
   npm run build
   ```

3. This will create a `build` directory with your production-ready files.

### 2. Upload to CPanel

Upload the contents of the `build` directory to your CPanel server:

1. Log in to your CPanel account
2. Navigate to File Manager
3. Go to the `public_html` directory or the subdirectory where you want to host the app
4. Upload all contents of the `build` directory

### 3. Alternative: Environment Variables in CPanel (Optional)

If you don't want to hardcode your API key in the build files, you can use server environment variables:

1. In your CPanel, look for "Software" or "Advanced" section and find "Environment Variables"
2. Add the variable: `REACT_APP_OPENAI_API_KEY` with your API key value
3. Save changes

Note: This approach may not work on all CPanel configurations. Check with your hosting provider to confirm environment variables are supported.

### 4. Testing

1. Navigate to your domain or subdomain in a browser
2. The application should load and connect to the OpenAI API
3. Test the voice recording and speech features

## Troubleshooting

### API Key Issues

If the application fails to connect to OpenAI:

1. Check the browser console for errors
2. Verify your API key is valid
3. Ensure the environment variable is correctly set

### Speech Recognition Issues

Speech recognition requires HTTPS to work in most browsers. If voice recording doesn't work:

1. Ensure your site has SSL/TLS enabled
2. Access the site with `https://` protocol

### Routing Issues

If routes aren't working correctly:

1. Make sure mod_rewrite is enabled on your CPanel server
2. Verify the `.htaccess` file was uploaded correctly
3. Check file permissions (`.htaccess` should be readable by the server)

## Security Considerations

When using client-side API calls to OpenAI:

1. Be aware that your API key is exposed to the client
2. Consider implementing rate limiting on your OpenAI account
3. For production applications with high traffic, consider creating a proxy server to handle API calls 