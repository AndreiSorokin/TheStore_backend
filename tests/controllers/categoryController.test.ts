import request, { Response, SuperTest, Test } from "supertest";

import connect, { MongoHelper } from "../db-helper";

import app from "../../src/app";
import { createCategory, registerAndLoginAdmin } from "../common/common";

const filePath = `${__dirname}/assets/cakeBoy.png`;

describe("category controller test", () => {
   let mongoHelper: MongoHelper;
   let adminToken: string;
   let categoryId: string;

   beforeAll(async () => {
      mongoHelper = await connect();

      adminToken = await registerAndLoginAdmin();
   })

   afterAll(async () => {
      await mongoHelper.closeDatabase();
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

   it("should create a new category with image upload", async () => {
      const categoryResponse = await request(app)
         .post('/api/v1/categories')
         .set("Authorization", adminToken)
         .field('name', 'name' )
         .attach('image', filePath, 'cakeBoy.png');
      categoryId = categoryResponse.body.id;

      expect(categoryResponse.status).toBe(201);
   });

   it('should update a category and return the updated category', async () => {
      const categoryResponse = await request(app)
         .post('/api/v1/categories')
         .set("Authorization", adminToken)
         .field('name', 'name' )
         .attach('image', filePath, 'cakeBoy.png');
         
      expect(categoryResponse.status).toBe(201);
      categoryId = categoryResponse.body.id;
      expect(categoryId).toBeDefined();

      const updatedData = { name: 'Updated Category' };

      const response = await request(app)
         .put(`/api/v1/categories/${categoryId}`)
         .set("Authorization", adminToken)
         .send(updatedData);

      expect(response.status).toBe(200);
   });

   it('should delete a category and return a 204 status code', async () => {
      const categoryResponse = await request(app)
         .post('/api/v1/categories')
         .set("Authorization", adminToken)
         .field('name', 'name' )
         .attach('image', filePath, 'cakeBoy.png');

      expect(categoryResponse.status).toBe(201);
      const categoryId = categoryResponse.body.id;

      const deleteResponse = await request(app)
         .delete(`/api/v1/categories/${categoryId}`)
         .set("Authorization", adminToken)

      expect(deleteResponse.status).toBe(204);
   });
})