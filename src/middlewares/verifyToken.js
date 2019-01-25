const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    res.status(401).json({
      message: 'Did not receive token',
      data: {}
    });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({
        message: 'Token Invalid or Expired',
        data: {}
      });
      return;
    }
    req.decoded = decoded;
    next();
  });
};

module.exports = verifyToken;
