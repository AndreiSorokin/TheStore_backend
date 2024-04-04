import request from "supertest";
import connect, { MongoHelper } from "../db-helper";

import app from "../../src/app";
import productServices from "../../src/services/products";
import { ProductDocument } from "../../src/models/Product";

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
})
