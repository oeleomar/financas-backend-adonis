import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().unique()

      table.string('name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').notNullable().unique()
      table.string('password_hash').notNullable().unique()
      table.decimal('net_salary')
      table.boolean('agree_rules').notNullable()

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
