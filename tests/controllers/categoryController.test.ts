import request, { Response, SuperTest, Test } from "supertest";
import fs from "fs";
import path from "path";

import connect, { MongoHelper } from "../db-helper";

import app from "../../src/app";
import { createCategory, createUser, getToken } from "../common/common";
import { Role } from "../../src/misc/types";
import User from "../../src/models/User";

export const filePath = path.resolve(__dirname, "assets", "cakeBoy.png");

describe("category controller test", () => {
   let mongoHelper: MongoHelper;
   let agent: request.SuperTest<request.Test>;
   let token: string;
   let res: Response;
   const requestBody = {
      name: "name",
   };
   let categoryId: string;

   beforeAll(async () => {
      mongoHelper = await connect();
      agent = request(app) as unknown as SuperTest<Test>;

      const user = await createUser("testUser", "testPass", "Test", "User", "testuser@test.com", Role.ADMIN);
      const loginResponse = await getToken(user.body.newUser.email, "testPass");
      token = loginResponse.body.token;
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

   // it("should create a new category with image upload", async () => {
   //    const response = await request(app)
   //       .post("/api/v1/categories")
   //       .set("Authorization", "Bearer " + token)
   //       .field("name", requestBody.name)
   //       .attach("image", filePath);

   //    expect(response.status).toBe(201);
   // });

   // it('should update a category and return the updated category', async () => {
   // const categoryResponse = await createCategory();
   // expect(categoryResponse).toBeDefined();
   // categoryId = categoryResponse._id;
   // expect(categoryId).toBeDefined();
   // console.log('categoryId', categoryId)

   // const updatedData = { name: 'Updated Category' };

   // const response = await request(app)
   //    .put(`/api/v1/categories/${categoryId}`)
   //    .set("Authorization", "Bearer " + token)
   //    .send(updatedData);

   // expect(response.status).toBe(200);
   // });

   // it('should delete a category and return a 204 status code', async () => {
   //    const createResponse = await request(app)
   //       .post("/api/v1/categories")
   //       .set("Authorization", "Bearer " + token)
   //       .field("name", requestBody.name)
   //       .attach("image", filePath);

   //    expect(createResponse.status).toBe(201);
   //    const categoryId = createResponse.body._id;

   //    const deleteResponse = await request(app)
   //       .delete(`/api/v1/categories/${categoryId}`)
   //       .set("Authorization", "Bearer " + token);

   //    expect(deleteResponse.status).toBe(204);
   // });
})