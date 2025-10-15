const handler = require('../apps/backend/dist/main.js').default;
module.exports = (req, res) => {
  return handler(req, res);
};
