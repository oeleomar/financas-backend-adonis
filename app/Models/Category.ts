import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { BaseModel, beforeCreate, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public color: string

  @column()
  public archived: boolean

  @column()
  public forExpenses: boolean

  @column()
  public userId: string

  @column()
  public imageId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(category: Category) {
    category.id = uuid()
  }

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>
}