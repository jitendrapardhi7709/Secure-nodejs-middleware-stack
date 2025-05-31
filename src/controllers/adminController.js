const { blacklistedIPs } = require('../middlewares/ipBlacklist');
const { apiKey } = require('../config/config');

function checkApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (key !== apiKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  next();
}

exports.getBlacklist = [
  checkApiKey,
  (req, res) => {
    res.json({ blacklistedIPs: Array.from(blacklistedIPs) });
  },
];

exports.addToBlacklist = [
  checkApiKey,
  (req, res) => {
    const { ip } = req.body;
    if (!ip) return res.status(400).json({ error: 'IP address required' });
    blacklistedIPs.add(ip);
    res.json({ message: `IP ${ip} added to blacklist` });
  },
];

exports.removeFromBlacklist = [
  checkApiKey,
  (req, res) => {
    const { ip } = req.body;
    if (!ip) return res.status(400).json({ error: 'IP address required' });
    blacklistedIPs.delete(ip);
    res.json({ message: `IP ${ip} removed from blacklist` });
  },
];
