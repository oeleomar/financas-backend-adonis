import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { BaseModel, beforeCreate, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'

export default class Image extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public file_name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(image: Image) {
    image.id = uuid()
  }

  @hasMany(() => Category)
  public categories: HasMany<typeof Category>
}
