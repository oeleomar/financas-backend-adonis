import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import {
  BaseModel,
  beforeCreate,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Revenue from './Revenue'
import Expense from './Expense'

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
  public default: boolean

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

  @manyToMany(() => User, { pivotTable: 'users_categories' })
  public users: ManyToMany<typeof User>

  @hasMany(() => Revenue)
  public revenues: HasMany<typeof Revenue>

  @hasMany(() => Expense)
  public expenses: HasMany<typeof Expense>
}
