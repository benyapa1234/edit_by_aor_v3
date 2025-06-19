// middleware/setCharset.js
const setCharset = (req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
};

export default setCharset;
