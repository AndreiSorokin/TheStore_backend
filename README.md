### Welcome to Our Internet Store REST API
This REST API provides functionality for managing an internet store. You can perform CRUD operations on the database and control user access to specific routes.
This project has been created through collaboration at Integrify:
1. https://github.com/AndreiSorokin 
2. https://github.com/LamNgo1911
3. https://github.com/naimulNoor
4. https://github.com/muzahidswe

### Deployment
Deployed on by Render
https://fs17-backend-89jl.onrender.com/

### Getting Started
In order to run the app you need to have the following installed:
-Node v18.14.1
-Node Package Manager

### Usage
- Start the production server with `npm start` or `yarn start` on mac
- Start the application in development mode with `npm run dev` or `yarn run dev` on mac
- Run tests with `npm test` or `yarn test` on mac 
- Restar the tests with `rs`

### ERD diagram

### Endpoints:
 1.**Products:**
- Get all products: https://fs17-backend-89jl.onrender.com/products
- Get one product: https://fs17-backend-89jl.onrender.com/products/:id
- Create a product: https://fs17-backend-89jl.onrender.com/products
- Edit a product: https://fs17-backend-89jl.onrender.com/products/:id
- Delete a product: https://fs17-backend-89jl.onrender.com/products/:id

 2.**Users:**
- Get all users: https://fs17-backend-89jl.onrender.com/users
- Get one user: https://fs17-backend-89jl.onrender.com/users/:id
- Registration : https://fs17-backend-89jl.onrender.com/users/registration
- Login: https://fs17-backend-89jl.onrender.com/users/login
- Login with Google: https://fs17-backend-89jl.onrender.com/users/auth/google
- Edit a user: https://fs17-backend-89jl.onrender.com/users/:id
- Delete a user : https://fs17-backend-89jl.onrender.com/users/:id
- Reset password: https://fs17-backend-89jl.onrender.com/users/forgot-password
- Change user's role: https://fs17-backend-89jl.onrender.com/users/:id/userInformation
- Ban/unbar a user: https://fs17-backend-89jl.onrender.com/users/changeUserStatus

 3.**Categories:**
- Get all categories: https://fs17-backend-89jl.onrender.com/categories
- Get one category: https://fs17-backend-89jl.onrender.com/categories/:id
- Create acategory: https://fs17-backend-89jl.onrender.com/categories
- Edit a category: https://fs17-backend-89jl.onrender.com/categories/:id
- Delete a category: https://fs17-backend-89jl.onrender.com/categories/:id 

 4.**Orders:**
- Get all orders: https://fs17-backend-89jl.onrender.com/orders
- Get one order: https://fs17-backend-89jl.onrender.com/orders/admin/:orderId
- Create an order: https://fs17-backend-89jl.onrender.com/orders
- Edit an order: https://fs17-backend-89jl.onrender.com/orders/:userId/:orderId
- Delete an order: https://fs17-backend-89jl.onrender.com/orders/:userId

### In this project we used:
- node.js with typescript
- nodemon
- express.js
- MongoDB
- mongoose
- nodemailer
- bcrypt
- dotenv
- jsonwebtoken
- passport
- jest
- supertest
- uuid
- validator