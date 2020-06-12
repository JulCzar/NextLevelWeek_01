const Knex = require('knex')

/**
 * 
 * @param {Knex} knex 
 */
const up = async knex => {
  return knex.schema.createTable('points', table => {
    table.increments('id').primary()
    table.string('image').notNullable()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.string('whatsapp').notNullable()
    table.decimal('latitude').notNullable()
    table.decimal('longitude').notNullable()
    table.string('city').notNullable()
    table.string('uf', 2).notNullable()
  })
}

/**
 * 
 * @param {Knex} knex 
 */
const down = async knex => {
  return knex.schema.dropTable('points')
}

module.exports = {
  up,
  down
}