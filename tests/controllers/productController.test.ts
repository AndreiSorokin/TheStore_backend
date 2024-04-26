import request from "supertest";
import connect, { MongoHelper } from "../db-helper";

import app from "../../src/app";
import productServices from "../../src/services/products";
import { ProductDocument } from "../../src/models/Product";

import fs from "fs";
import path from "path";
import { createProduct, getToken } from "../common/common";
import User from "../../src/models/User";
import { Role } from "../../src/misc/types";

describe('product controller test', () => {
   let mongoHelper: MongoHelper;

   let adminToken: any;

   beforeAll(async () => {
      mongoHelper = await connect();

      const register = await request(app)
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
         .send({ email: register.body.newUser.email, password: 'password' });

         
      adminToken = `Bearer ${loginResponse.body.token}`;
   });

   afterAll(async () => {
      await mongoHelper.closeDatabase();
      // await mongoHelper.clearDatabase();
   });
   
   afterEach(async () => {
      // await mongoHelper.clearDatabase();
   });

   it("should return a list of products", async() => {
      const response = await request(app)
         .get('/api/v1/products')

         expect(response.status).toBe(200);
         expect(response.body.products.length).toEqual(0);
   })

   it("should return a single product", async() => {
      const mockProduct: ProductDocument = { _id: '123', name: 'Product Name', price: 10 } as ProductDocument;
      jest.spyOn(productServices, 'getOneProduct').mockResolvedValue(mockProduct);
      
      const response = await request(app).get('/api/v1/products/123');
      console.log('response',response.body)
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockProduct);
   });

   it("should create a new product", async () => {
      // mongoHelper = await connect();

  //    const imagePath = path.join(__dirname, '../assets/cakeBoy.png');
      const filePath = `${__dirname}/assets/cakeBoy.png`;
      console.log("File path:",filePath)
      if (!fs.existsSync(filePath)) {
         throw new Error('Image file does not exist');
      }

      console.log('imagePath',filePath)
      
      const categoryResponse = await request(app)
         .post('/api/v1/categories')
         .set("Authorization", adminToken)
         .field('name', 'name' )
         .attach('image', filePath, 'cakeBoy.png');
      const categoryId = categoryResponse.body.id;

      console.log('categoryResponse.body', categoryResponse.body)

      const productData = {
         name: 'Test Product',
         price: 20,
         description: 'A test product description',
         categoryId: categoryId,
         size: 'Medium',
         gender: 'Male',
      };
      console.log('productData', productData)

      const response = await request(app)
         .post('/api/v1/products')
         .set("Authorization", adminToken)
         .field('name', productData.name)
         .field('price', productData.price)
         .field('description', productData.description)
         .field('categoryId', productData.categoryId)
         .field('size', productData.size)
         .field('gender', productData.gender)
         .attach('images', filePath, 'cakeBoy.png');

      console.log('response.body',response)
      

      expect(response.status).toBe(201);
   });

   // it("should update a product", async () => {
   //    const product = await createProduct();

   //    const updatedProductData = {
   //       name: 'Updated Product',
   //       price: 120,
   //       description: 'Updated description',
   //    };

   //    const response = await request(app)
   //       .put(`/api/v1/products/${product._id}`)
   //       .set("Authorization", adminToken)
   //       .send(updatedProductData);

   //    expect(response.status).toBe(200);
   //    expect(response.body).toHaveProperty('_id', product._id.toString());
   // });

   // it("should delete a product", async () => {
   //    const product = await createProduct();
   
   //    const deleteResponse = await request(app)
   //       .delete(`/api/v1/products/${product._id}`)
   //       .set("Authorization", adminToken);
   
   //    expect(deleteResponse.status).toBe(204);
   
   //    const fetchResponse = await request(app).get(`/api/v1/products/${product._id}`);
   //    expect(fetchResponse.status).toBe(404);
   // });
})
