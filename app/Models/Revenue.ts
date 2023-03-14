import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export default class Revenue extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public description: string

  @column()
  public value: number

  @column()
  public isRecived: boolean

  @column()
  public recivedDate: Date

  @column()
  public fixedIncome: boolean

  @column()
  public repeat: boolean

  @column()
  public timesRepeat: number

  @column()
  public userId: string

  @column()
  public categoryId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(revenue: Revenue) {
    revenue.id = uuid()
  }
}
