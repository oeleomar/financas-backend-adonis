import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().unique()

      table.string('name').unique().notNullable()
      table.string('color').notNullable()
      table.boolean('archived').notNullable()
      table.boolean('for_expenses').notNullable()
      table.boolean('default').notNullable()

      table
        .string('image_id')
        .references('images.id')
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
