# Super French Teacher

An interactive React application to help users learn French with 3D models and an AI chat interface.

## Features

- Interactive 3D scene with French-themed models (croissant, bread, champagne, Eiffel Tower, etc.)
- Click to respawn models in new positions
- Conversational French learning through an AI chat interface

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deploying to CPanel

To deploy this application to CPanel, follow these steps:

1. Create a production build:
   ```
   npm run build
   ```

2. The build process creates a `build` folder with optimized static files.

3. Upload the entire contents of the `build` folder to your CPanel hosting:
   - Use the File Manager in CPanel or an FTP client like FileZilla
   - Upload to your public_html directory (or subdomain directory)
   - Make sure to include the `.htaccess` file

4. Important: Ensure the 3D models are properly uploaded:
   - The models should be in the `/models` directory on your server
   - Check that all model files (croissant.glb, bread.glb, etc.) are uploaded

5. Visit your domain in a browser to verify the deployment.

For a more detailed deployment guide, see the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) file.

## Development

This project was created with:
- React
- React Three Fiber / Drei
- React Router
- Three.js

## License

This project is licensed under the MIT License.

## Environment Setup

This application requires an OpenAI API key to function. Follow these steps to set it up:

1. Create a copy of the `.env.example` file and name it `.env.local`
2. Replace `your_openai_key_here` with your actual OpenAI API key
3. Restart the development server if it's already running

The `.env.local` file should look like this:
```
REACT_APP_OPENAI_API_KEY=sk-your_actual_openai_key_here
```

Your API key is stored only in your local environment and is never sent to any server other than OpenAI's API endpoints.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
