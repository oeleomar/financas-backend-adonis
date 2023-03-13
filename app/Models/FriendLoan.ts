import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export default class FriendLoan extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public description: string

  @column()
  public date: DateTime

  @column()
  public value: number

  @column()
  public beReturned: boolean

  @column()
  public returnedDay: DateTime

  @column()
  public friendId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(friendLoan: FriendLoan) {
    friendLoan.id = uuid()
  }
}
