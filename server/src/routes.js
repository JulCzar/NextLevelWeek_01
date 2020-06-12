const express = require('express')
const { celebrate, Joi } = require('celebrate')

const multer = require('multer')
const multerConfig = require('./config/multer')

const createPointsController = require('./controllers/PointsController')
const createItemsController = require('./controllers/ItemsController')

const pointsController = createPointsController()
const itemsController = createItemsController()

const routes = express.Router()
const upload = multer(multerConfig)

routes.get('/items', itemsController.index)
routes.get('/points', pointsController.index)
routes.get('/points/:id', pointsController.show)

routes.post(
  '/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required()
    })
  }, {
    abortEarly: false
  }),
  pointsController.create)

module.exports = routes