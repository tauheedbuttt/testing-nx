// org/api/index.js (The NON-CRASHING Debugging Wrapper)

const fs = require('fs');
const path = require('path');

// This is the function Vercel will attempt to execute
module.exports = (req, res) => {
  // Log the current directories immediately
  console.log('--- VERCEL TASK ROOT (CWD) ---');
  console.log('CWD:', process.cwd());
  console.log('__dirname:', __dirname);

  try {
    // Find the root of the task environment: /var/task
    const taskRootPath = path.resolve(__dirname, '..');
    console.log('Task Root Path (..):', taskRootPath);

    // Log contents of the assumed target: /var/task/apps/backend/dist
    const targetPath = path.join(taskRootPath, 'apps', 'backend', 'dist');

    console.log(`\n*** TARGET PATH: ${targetPath} ***`);

    if (fs.existsSync(targetPath)) {
      fs.readdirSync(targetPath).forEach((file) => {
        console.log(`- ${file}`);
      });
    } else {
      console.error('*** TARGET PATH DOES NOT EXIST! ***');

      // Log the contents of the entire task root for maximum visibility
      console.log('\n*** FILES IN /var/task/ ***');
      fs.readdirSync(taskRootPath).forEach((file) => {
        console.log(`- ${file}`);
      });
    }
  } catch (e) {
    console.error('CRITICAL LOGGING ERROR:', e.message);
  }

  // Return a 200/500 response immediately without loading the NestJS app
  // The important part is that the console logs are captured by Vercel.
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end(
    'Deployment Path Debugging Complete. Check Vercel Logs for File Structure.'
  );
};
