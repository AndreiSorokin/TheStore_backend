import request from "supertest";
import connect, { MongoHelper } from "../db-helper";

import app from "../../src/app";
import productServices from "../../src/services/products";
import { ProductDocument } from "../../src/models/Product";

describe('product controller test', () => {
   let mongoHelper: MongoHelper;

   let adminToken: any;

beforeAll(async () => {
  mongoHelper = await connect();

  // Simulate admin login to obtain JWT token
  const loginResponse = await request(app)
    .post('http://localhost:8080/api/v1/users/login')
    .send({
      email: 'kenici780@gmail.com',
      password: 'password1'
    });

  adminToken = `Bearer ${loginResponse.body.token}`; // Adjust according to how your login response structure is
});

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

   // it("should create a new product", async () => {
   //    const categoryId = "mockCategoryId"; 

   //    const productData = {
   //       name: "Test Product",
   //       price: 100,
   //       description: "A test product description",
   //       categoryId: categoryId,
   //       size: "Medium",
   //       gender: "Unisex",
   //       images: ["http://example.com/testimage.jpg"] 
   //    };

   //    const response = await request(app)
   //       .post('/api/v1/products')
   //       .set('Authorization', adminToken)
   //       .send(productData);

   //    expect(response.status).toBe(201);
   // });
})
