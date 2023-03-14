import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'expenses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()

      table.string('description').notNullable()
      table.decimal('value').notNullable()
      table.date('payday').notNullable()
      table.boolean('fixed_expense').notNullable()
      table.boolean('repeat').notNullable()
      table.integer('times_repeat')

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
