const allowedCors = [
  'https://marymary.students.nomoreparties.co',
  'http://marymary.students.nomoreparties.co',
  'https://api.marymary.students.nomoreparties.co',
  'http://api.marymary.students.nomoreparties.co',
  'http://localhost:3000',
  'https://localhost:3000',
  'http:127.0.0.1:3000'
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};