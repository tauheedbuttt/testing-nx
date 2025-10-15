// org/api/index.js

// This uses Node's path module to construct an absolute path
// that should reliably point to the included built file.
const path = require('path');

// __dirname is /var/task/api. We move up one level (..) to the task root,
// then follow the absolute path to your compiled app.
const mainPath = path.resolve(
  __dirname,
  '..',
  'apps',
  'backend',
  'dist',
  'main.js'
);

const handler = require(mainPath).default;

module.exports = (req, res) => {
  return handler(req, res);
};
