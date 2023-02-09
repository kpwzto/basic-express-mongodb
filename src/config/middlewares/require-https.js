// Force https
module.exports = function requireHTTPS(req, res, next) {
  if (
    process.env.APP_ENV !== 'test' &&
    process.env.APP_ENV !== 'development'
  ) {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
};
