/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', async () => {
    return { hello: 'world' }
  })

  Route.resource('/users', 'UsersController').apiOnly()

  //Friend
  Route.post('/users/:id/friend', 'FriendsController.store')
  Route.delete('/users/:id/friend', 'FriendsController.destroy')
  Route.put('/users/friend/:id', 'FriendsController.update')

  //Friend Loan
  Route.post('/friend/:friendId/loan', 'FriendLoansController.store')
  Route.get('/friend/loan/:id', 'FriendLoansController.show')
  Route.delete('/friend/loan/:id', 'FriendLoansController.destroy')
  Route.put('/friend/loan/:id', 'FriendLoansController.update')

  Route.post('/images', 'ImagesController.store')
  Route.get('/images', 'ImagesController.index')
}).prefix('/api')
