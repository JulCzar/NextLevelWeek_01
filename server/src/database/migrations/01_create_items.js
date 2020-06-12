const Knex = require('knex')

/**
 * 
 * @param {Knex} knex 
 */
const up = async knex => {
  return knex.schema.createTable('items', table => {
    table.increments('id').primary()
    table.string('image').notNullable()
    table.string('title').notNullable()
  })
}

/**
 * 
 * @param {Knex} knex 
 */
const down = async knex => {
  return knex.schema.dropTable('items')
}

module.exports = {
  up,
  down
}