import request from "supertest";
import connect, { MongoHelper } from "../db-helper";

import app from "../../src/app";
import { createCategory } from "../common/common";

describe("category controller test", () => {
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

   it("should return a list of categiries", async() => {
      const response = await request(app)
         .get('/api/v1/categories')

         expect(response.status).toBe(200);
         expect(response.body.length).toEqual(0);
   })

   it("should return a single category", async () => {
      const createdCategory = await createCategory();

      const response = await request(app).get(`/api/v1/categories/${createdCategory._id}`);

      expect(response.status).toBe(201);
      expect(createdCategory).toHaveProperty("_id");
   });
})