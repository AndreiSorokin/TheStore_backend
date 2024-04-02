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


   it("should get all products", async() => {
      const response = await request(app)
         .get('api/v1/products')

         expect(response.status).toBe(200);
         expect(response.body.length).toEqual(0);
   })
})
