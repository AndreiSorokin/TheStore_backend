import request from "supertest";
import connect, { MongoHelper } from "../db-helper";

import app from "../../src/app";

async function createUser() {
   const data = {
      username: 'name',
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email@example.com',
      role: 'ADMIN',
   }
   return await request(app).post("/api/v1/users").send(data)
}

async function getToken(email: string, password: string) {
   return await request(app)
      .post("/api/v1/users/login")
      .send({ 
         email: 'email@example.com',
         password: 'password'
      })
}

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

   it("should create a category when use is ADMIN", async () => {
      const userResponse = await createUser();

      const userData = await getToken(userResponse.body.email, "password");
      const token = userData.body.token;

      const response = await request(app)
         .post("/api/v1/products")
         .set("Authorization", "Bearer " + token)
         .send({ 
            name: "name", 
            price: 111, 
            description: "description", 
            category: "category1", 
            image: "img1", 
            size: "Large" 
         });
   
      expect(response.status).toBe(201);
   
      // expect(response.body).toMatchObject({
      //    newCategory: {
      //       name: "name", 
      //       price: 111, 
      //       description: "description", 
      //       category: "category1", 
      //       image: "img1", 
      //       size: "Large",
      //       _id: expect.any(String),
      //       __v: expect.any(Number),
      //    },
      // });
   });
})
