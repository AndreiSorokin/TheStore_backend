import request from "supertest";

import Category from "../../src/models/Category";
import Product from "../../src/models/Product";
import productServices from "../../src/services/products";
import categoryServices from "../../src/services/category";
import app from "../../src/app";
import { Role } from "../../src/misc/types";

export async function createCategory() {
   const category = new Category({
      name: "Clothes",
      image: "img.png",
   });
   return await categoryServices.createCategory(category);
}

export async function createProduct() {
   const category = await createCategory();

   const product = new Product({ 
      name: "name1", 
      price: 111, 
      description: "description", 
      category: category._id, 
      image: "img1", 
      size: "Large",
      gender: "Male"
   });
   return await productServices.createProduct(product);
}

export async function registerAndLoginAdmin() {
    const registerResponse = await request(app)
        .post('/api/v1/users/registration')
        .send({ 
            username: "username",
            password: "password",
            firstName: "firstName",
            lastName: "lastName",
            email: "email@gmail.com",
            role: Role.ADMIN,
            avatar: "img"
        });

    const loginResponse = await request(app)
        .post('/api/v1/users/login')
        .send({ email: registerResponse.body.newUser.email, password: 'password' });

    const adminToken = `Bearer ${loginResponse.body.token}`;
    return adminToken;
}

export async function createUser(username: string, password: string, firstName: string, lastName: string, email: string, role: Role) {
   const data = {
      username,
      password,
      firstName,
      lastName,
      email,
      role,
   }
   return await request(app).post("/api/v1/users/registration").send(data)
}

export async function getToken(email: string, password: string) {
   return await request(app).post("/api/v1/users/login").send({ email, password });
}

