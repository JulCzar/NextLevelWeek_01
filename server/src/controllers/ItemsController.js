const knex = require('../database/connection')

const createItemsController = () => {
  const index = async (req, res) => {
    const items = await knex('items').select('*')

    const serializedItems = items.map(({ id, title, image }) => ({
      id,
      title,
      img_url: `http://localhost:4000/uploads/${image}`
    }))

    return res.json(serializedItems)
  }

  return {
    index
  }
}

module.exports = createItemsController