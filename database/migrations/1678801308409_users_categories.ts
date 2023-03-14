import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users_categories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .string('user_id')
        .references('users.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable()

      table
        .string('category_id')
        .references('categories.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable()

      table.unique(['user_id', 'category_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
