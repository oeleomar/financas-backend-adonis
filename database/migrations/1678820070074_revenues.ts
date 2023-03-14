import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'revenues'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()

      table.string('description').notNullable()
      table.decimal('value').notNullable()
      table.boolean('is_recived').notNullable()
      table.date('recived_date')
      table.boolean('fixed_income').notNullable()
      table.boolean('repeat').notNullable()
      table.decimal('times_repeat')

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
