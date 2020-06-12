const multer = require('multer')
const crypto = require('crypto')
const path = require('path')

const filename = (req, file, callback) => {
  const hash = crypto.randomBytes(6).toString('hex')

  const filename = `${hash}-${file.originalname}`

  callback(null, filename)
}

module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename
  })
}