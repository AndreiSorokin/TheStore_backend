import request from "supertest";
import fs from "fs";
import path from "path";

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

   // it("should create a new category", async () => {
   //    const imagePath = path.join(__dirname, "testImage.png");
   //    const testImage = fs.readFileSync(imagePath);
      
   //    const response = await request(app)
   //       .post("/api/v1/categories")
   //       .set("Content-Type", "multipart/form-data")
   //       .field("name", "Test Category")
   //       .attach("image", testImage, "testImage.png");
      
   //    expect(response.status).toBe(201);
   //    expect(response.body).toHaveProperty("_id");
   //    expect(response.body).toHaveProperty("name", "Test Category");
   //    expect(response.body).toHaveProperty("image");
   // });
})