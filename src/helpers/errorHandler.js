async function errorHandler(err, req, res, next) {
  switch (err.name) {
    case `Content Not Found`:
      res.status(404).json({ message: err.name });
      break;
    case `Invalid Username or Password`:
      res.status(401).json({ message: err.name });
      break;
    case `Unauthorized Access`:
      res.status(401).json({ message: err.name });
      break;
    case `Forbidden Access`:
      res.status(403).json({ message: err.name });
      break;
    default:
      res.status(500).json({ message: `Internal Server Error` });
      break;
  }
}

module.exports = errorHandler;
