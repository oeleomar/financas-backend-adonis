import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category'
import User from 'App/Models/User'

export default class CategoriesController {
  public async index({ params, response }: HttpContextContract) {
    try {
      const userCategories = await User.findOrFail(params.userId)
      await userCategories.load('categories')

      return {
        message: 'Sucesso',
        data: userCategories,
      }
    } catch (err) {
      return response.notFound({ message: 'Não foi possivel carregar as categorias' })
    }
  }

  public async store({ params, request, response }: HttpContextContract) {
    const categorySchema = schema.create({
      name: schema.string(),
      color: schema.string(),
      archived: schema.boolean(),
      forExpenses: schema.boolean(),
      default: schema.boolean.nullableAndOptional(),
    })

    try {
      await request.validate({ schema: categorySchema })
    } catch (err) {
      return response.badRequest({
        message: `${err?.messages?.errors[0]?.field || ''} ${err?.messages?.errors[0]?.rule || ''}`,
      })
    }

    const body = request.body()
    if (!body.default) body.default = false

    if (body.default) {
      try {
        const category = await Category.create(body)

        return {
          message: 'Categoria padrão criada com sucesso',
          data: category,
        }
      } catch (err) {
        return response.badRequest({ message: 'Não foi possivel criar a categoria' })
      }
    }

    try {
      const user = await User.findOrFail(params.userId)
      await user.related('categories').create(body)

      response.status(201)

      return {
        message: 'Categoria criada com sucesso',
        data: user.categories,
      }
    } catch (err) {
      return response.badRequest({ message: 'Não foi possível criar a categoria' })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id)
      const body = request.body()

      if (body.name) category.name = body.name
      if (body.color) category.color = body.color
      if (body.archived) category.archived = body.archived
      if (body.forExpenses) category.forExpenses = body.forExpenses
      if (body.imageId) category.imageId = body.imageId

      category.save()

      return {
        message: 'Categoria atualizada com sucesso',
        data: category,
      }
    } catch (err) {
      return response.badRequest({
        message: 'Não foi possivel atualizar a categoria, tente mais tarde',
      })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.delete()

      return {
        message: 'Categoria apagada com sucesso',
      }
    } catch (err) {
      return response.badRequest({
        message: 'Não foi possivel apargar a categoria, tente novamente mais tarde. ',
      })
    }
  }
}
