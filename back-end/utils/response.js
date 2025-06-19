export function success(res, data) {
  res.status(200).json({ success: true, data });
}
export function error(res, message, code = 500) {
  res.status(code).json({ success: false, message });
}
