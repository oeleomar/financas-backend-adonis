import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'friend_loans'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().unique()

      table.string('description')
      table.date('date')
      table.decimal('value')
      table.boolean('be_returned')
      table.date('returned_day')

      table
        .string('friend_id')
        .references('friends.id')
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
