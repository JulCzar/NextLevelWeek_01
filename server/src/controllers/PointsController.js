const knex = require('../database/connection')

const createPointController = () => {
  const index = async (req, res) => {
    const { city, uf, items } = req.query

    const parsedItems = items
      .split(',')
      .map(item => Number(item.trim()))

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', city)
      .where('uf', uf)
      .distinct()
      .select('points.*')

    const serializedPoints = points.map(point => ({
      ...point,
      image: `http://192.168.0.104:4000/uploads/${point.image}`
    }))

    return res.json(serializedPoints)
  }

  const show = async (req, res) => {
    const { id } = req.params

    const point = await knex('points').where('id', id).first();

    if (!point)
      return res
        .status(400)
        .json({ message: 'point not found' })
    
    const serializedPoint = {
      ...point,
      image: `http://192.168.0.104:4000/uploads/${point.image}`
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)

    return res.json({ point: serializedPoint, items })
  }
  
  const create = async (req, res) => {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = req.body
  
    const trx = await knex.transaction()

    const point = {
      image: req.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    }
  
    const inserted_ids = await trx('points').insert(point)
  
    const point_id = inserted_ids[0]
  
    const pointItems = items
      .split(',')
      .map(item => parseInt(item
        .trim()))
        .map(item_id => ({item_id, point_id}))
  
    await trx('point_items').insert(pointItems)

    await trx.commit()
  
    return res.json({ id: point_id, ...point})
  }
  
  return {
    index,
    show,
    create
  }
}

module.exports = createPointController