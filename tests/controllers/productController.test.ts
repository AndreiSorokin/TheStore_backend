import request from "supertest";
import connect, { MongoHelper } from "../db-helper";

import app from "../../src/app";
import productServices from "../../src/services/products";
import Product, { ProductDocument } from "../../src/models/Product";
import { createCategory, createUser, getToken } from "../common/common";
import { Role } from "../../src/misc/types";

describe('product controller test', () => {
   let mongoHelper: MongoHelper;

   beforeAll(async () => {
      mongoHelper = await connect()
   })

   afterAll(async () => {
      await mongoHelper.closeDatabase();
   });
   
   afterEach(async () => {
      await mongoHelper.clearDatabase();
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
      
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockProduct);
   });

   it("should create a product when user is an admin", async() => {
      
      const response = await createUser(
      'name',
      'password',
      'firstName',
      'lastName',
      'email@example.com',
      Role.ADMIN
      )

      const userData = await getToken(response.body.email, "password")
      const token = userData.body.token

      const category = await createCategory();
      console.log("Category ID:", category._id);

      const product = {
         name: "name1", 
         price: 111, 
         description: "description", 
         category: category._id, 
         image: "img1", 
         size: "Large" 
      };

      console.log("Category:", product.category);

      const productResponse = await request(app)
         .post("/api/v1/products")
         .set("Authorization", "Bearer " + token)
         .send(product);


      console.log("productResponse", productResponse.body)
      expect(productResponse.status).toBe(201);
   })
})
