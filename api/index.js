// org/api/index.js (The NEW Debugging Wrapper)

const fs = require('fs');
const path = require('path');

// This is the function Vercel will attempt to execute
module.exports = (req, res) => {
  // --- VERCEL PATHS ---
  console.log('--- VERCEL PATHS & DIRECTORIES ---');
  console.log('CWD (Task Root?):', process.cwd());
  console.log('__dirname (Function Root):', __dirname);

  try {
    const taskRootPath = path.resolve(__dirname, '..'); // Should be /var/task

    // --- LOG /var/task/ (TASK ROOT) CONTENTS ---
    console.log('\n*** FILES IN /var/task/ (Root of Task) ***');
    fs.readdirSync(taskRootPath).forEach((file) => {
      const isDir = fs.lstatSync(path.join(taskRootPath, file)).isDirectory()
        ? '(DIR)'
        : '(FILE)';
      console.log(`- ${file} ${isDir}`);
    });

    // --- LOG /var/task/api/ (FUNCTION ROOT) CONTENTS ---
    console.log('\n*** FILES IN /var/task/api/ (Function Directory) ***');
    fs.readdirSync(__dirname).forEach((file) => {
      const isDir = fs.lstatSync(path.join(__dirname, file)).isDirectory()
        ? '(DIR)'
        : '(FILE)';
      console.log(`- ${file} ${isDir}`);
    });
  } catch (e) {
    console.error('\nCRITICAL LOGGING ERROR:', e.message);
  }

  // Return a response and exit gracefully to persist logs
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end(
    'Deployment Path Debugging Complete. Check Vercel Logs for File Structure.'
  );
};
