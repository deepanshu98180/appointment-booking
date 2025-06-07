//@ts-check
const { encrypter } = require("./cryptoUtil");

const sendSuccessResponse = (res, status, message, data = {}) => {
   let responseJSON = encrypter({
    status,
    message,
    data,
  })
  return res.status(200).json(responseJSON);
}
const errorResponse = (res, status, message, data = {}) => {
  let responseJSON = encrypter({
    status,
    message,
    data,
  })
  return res.status(400).json(responseJSON);
}

module.exports = { sendSuccessResponse, errorResponse }
