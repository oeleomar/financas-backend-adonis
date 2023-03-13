import { v4 as uuid } from 'uuid'
import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  beforeSave,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Friend from './Friend'

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public passwordHash: string

  @column()
  public net_salary: number

  @column()
  public agree_rules: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuid()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.passwordHash) {
      user.passwordHash = await Hash.make(user.passwordHash)
    }
  }

  @hasMany(() => Friend)
  public friends: HasMany<typeof Friend>
}
