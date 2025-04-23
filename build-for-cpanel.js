const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

console.log(`${colors.blue}Super French Teacher - CPanel Build Script${colors.reset}`);
console.log(`${colors.yellow}============================================${colors.reset}`);

// Check if archiver is installed
try {
  require.resolve('archiver');
} catch (e) {
  console.log(`${colors.yellow}Installing required dependencies...${colors.reset}`);
  execSync('npm install --save-dev archiver', { stdio: 'inherit' });
  console.log(`${colors.green}Dependencies installed successfully.${colors.reset}`);
}

// Step 1: Build the React application
console.log(`\n${colors.blue}Step 1: Building React application...${colors.reset}`);
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log(`${colors.green}Build completed successfully.${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Build failed:${colors.reset}`, error.message);
  process.exit(1);
}

// Step 2: Create deployment package
console.log(`\n${colors.blue}Step 2: Creating deployment package...${colors.reset}`);

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Create a zip file
const output = fs.createWriteStream(path.join(distDir, 'super-french-teacher.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  const sizeInMB = (archive.pointer() / 1048576).toFixed(2);
  console.log(`${colors.green}Deployment package created successfully.${colors.reset}`);
  console.log(`${colors.green}Package size: ${sizeInMB} MB${colors.reset}`);
  console.log(`${colors.green}Package location: ${path.join(distDir, 'super-french-teacher.zip')}${colors.reset}`);
  
  console.log(`\n${colors.blue}Deployment Instructions:${colors.reset}`);
  console.log(`${colors.yellow}1. Upload the contents of the build folder to your CPanel public_html directory${colors.reset}`);
  console.log(`${colors.yellow}2. Ensure the .htaccess file is properly uploaded${colors.reset}`);
  console.log(`${colors.yellow}3. Make sure all model files in the models/ directory are uploaded correctly${colors.reset}`);
  console.log(`\n${colors.blue}For more detailed instructions, please refer to the DEPLOYMENT_GUIDE.md file.${colors.reset}`);
});

archive.on('error', (err) => {
  console.error(`${colors.red}Error creating deployment package:${colors.reset}`, err);
  process.exit(1);
});

// Pipe archive data to the file
archive.pipe(output);

// Add the build folder to the archive
archive.directory('build/', false);

// Add the deployment guide
archive.file('DEPLOYMENT_GUIDE.md', { name: 'DEPLOYMENT_GUIDE.md' });

// Finalize the archive
archive.finalize(); 