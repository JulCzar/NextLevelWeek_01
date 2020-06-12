const Knex = require('knex')

/**
 * 
 * @param {Knex} knex 
 */
const up = async knex => {
  return knex.schema.createTable('point_items', table => {
    table.increments('id').primary()
    table.integer('point_id')
      .notNullable()
      .references('id')
      .inTable('points')
    table.integer('item_id')
      .notNullable()
      .references('id')
      .inTable('items')
  })
}

/**
 * 
 * @param {Knex} knex 
 */
const down = async knex => {
  return knex.schema.dropTable('point_items')
}

module.exports = {
  up,
  down
}