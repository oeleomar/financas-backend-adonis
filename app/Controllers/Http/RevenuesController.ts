import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Revenue from 'App/Models/Revenue'
import User from 'App/Models/User'

export default class RevenuesController {
  public async store({ request, response }: HttpContextContract) {
    const revenueSchema = schema.create({
      description: schema.string(),
      value: schema.number(),
      isRecived: schema.boolean(),
      recivedDate: schema.date({ format: 'MM-dd-yyyy' }),
      fixedIncome: schema.boolean(),
      repeat: schema.boolean(),
      timesRepeat: schema.number.nullableAndOptional(),
      userId: schema.string(),
      categoryId: schema.string(),
    })

    try {
      await request.validate({ schema: revenueSchema })
    } catch (err) {
      return response.badRequest({
        message: `${err?.messages?.errors[0]?.field || ''} ${err?.messages?.errors[0]?.rule || ''}`,
      })
    }

    const body = request.body()

    if (body.repeat) {
      const revenuesArray: any = []

      for (let index = 0; index < body.timesRepeat; index++) {
        const date = new Date(body.recivedDate)

        const data = {
          description: body.description,
          value: body.value,
          isRecived: body.isRecived,
          recivedDate: new Date(date.setMonth(date.getMonth() + (index + 1))).toLocaleDateString(
            'pt-BR',
            { timeZone: 'UTC' }
          ),
          fixedIncome: body.fixedIncome,
          repeat: body.repeat,
          timesRepeat: body.timesRepeat,
          userId: body.userId,
          categoryId: body.categoryId,
        }

        revenuesArray.push(data)
      }

      try {
        const revenues = await Revenue.createMany(revenuesArray)
        response.status(201)
        return {
          message: 'Sucesso',
          data: revenues,
        }
      } catch (err) {
        console.log(err)
        return response.badRequest({
          message: 'Impossivel criar receita, tente novamente mais tarde',
        })
      }
    }

    try {
      const revenue = await Revenue.create(body)
      response.status(201)
      return {
        message: 'Receita criada com sucesso',
        data: revenue,
      }
    } catch (err) {
      return response.badRequest({
        message: 'Impossivel criar receita, tente novamente mais tarde',
      })
    }
  }

  public async index({ params, response }: HttpContextContract) {
    try {
      const data = await User.findOrFail(params.userId)
      await data.load('revenues')
      return {
        message: 'Receitas buscadas com sucesso',
        data,
      }
    } catch (err) {
      return response.badRequest({ message: 'Não foi possivel buscar as receitas' })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const body = request.body()
      const revenue = await Revenue.findOrFail(params.id)

      body.description ? (revenue.description = body.description) : null
      body.value ? (revenue.value = body.value) : null
      body.isRecived ? (revenue.isRecived = body.isRecived) : null
      body.recivedDate ? (revenue.recivedDate = body.recivedDate) : null
      body.fixedIncome ? (revenue.fixedIncome = body.fixedIncome) : null

      await revenue.save()

      return {
        message: 'Receita atualizada com sucesso',
        data: revenue,
      }
    } catch (err) {
      return response.notFound({
        message: 'Não foi possivel encontrar a receita, tente novamente mais tarde',
      })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const revenue = await Revenue.findOrFail(params.id)
      await revenue.delete()

      return {
        message: 'Apagado com sucesso',
      }
    } catch (err) {
      return response.badRequest({
        message: 'Não foi possivel apagar no momento, tente novamente mais tarde',
      })
    }
  }
}
