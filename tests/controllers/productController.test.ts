import request from "supertest";
import connect, { MongoHelper } from "../db-helper";

import app from "../../src/app";


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

   // it("should create a category", async () => {
   //    const response = await request(app)
   //       .post("/api/v1/products")
   //       .send({ 
   //          name: "Name", 
   //          price: 111, 
   //          description: "description", 
   //          category: "category1", 
   //          image: "img1", 
   //          size: "Large" 
   //       });
   //    console.log("Response:", response.status, response.body);
   
   //    expect(response.status).toBe(201);
   
   //    expect(response.body).toMatchObject({
   //       newCategory: {
   //          name: "Name", 
   //          price: 111, 
   //          description: "description", 
   //          category: "category1", 
   //          image: "img1", 
   //          size: "Large",
   //          _id: expect.any(String),
   //          __v: expect.any(Number),
   //       },
   //    });
   // });
})
