import request from "supertest";
import connect, { MongoHelper } from "../db-helper";

import app from "../../src/app";
import { createUser, getToken } from "../common/common";
import { Gender, Role, Size } from "../../src/misc/types";
import Product from "../../src/models/Product";
import Category from "../../src/models/Category";
import Order from "../../src/models/Order";

describe('order controller test', () => {
   let mongoHelper: MongoHelper;
   let token: string;
   let userId: string;
   let productId: string;
   let orderId: string;

   beforeAll(async () => {
      mongoHelper = await connect();
      const user = await createUser("testUser", "testPass", "Test", "User", "testuser@test.com", Role.ADMIN);
      userId = user.body.newUser.id;
      const loginResponse = await getToken(user.body.newUser.email, "testPass");
      token = loginResponse.body.token;

      const category = new Category({
         name: 'Test Category',
         image: '../assets/cakeBoy.png',
      });
      await category.save();

      const product = new Product({
         name: 'Test Product',
         price: 100,
         category: category._id,
         image: 'testimage.jpg',
         gender: Gender.Male,
         size: Size.Small,
         description: 'A description',
      });
      await product.save();
      productId = product.id;

      const order = new Order({userId: userId});
      await order.save();
      orderId = order.id;
   });

   afterAll(async () => {
      await Order.findByIdAndDelete(orderId);
      await mongoHelper.closeDatabase();
   });

   afterEach(async () => {
      await mongoHelper.clearDatabase();
   });

   it('should return all orders', async () => {
    const response = await request(app)
      .get('/api/v1/orders')
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(200);
   });

   // it('should create an order', async () => {
   //    const orderItems = [{
   //       quantity: 1,
   //       productId: productId,
   //       image: 'testimage.jpg',
   //    }];

   //    const response = await request(app)
   //       .post(`/api/v1/orders/${userId}`)
   //       .set('Authorization', `Bearer ${token}`)
   //       .send({
   //          userId: userId,
   //          items: orderItems,
   //       });

   //    expect(response.status).toBe(201);
   //    });

   // it('should return a single order by ID', async () => {
   //    const response = await request(app)
   //       .get(`/api/v1/orders/admin/${orderId}`)
   //       .set('Authorization', `Bearer ${token}`);
      
   //    expect(response.status).toBe(200);
   // });

   // it('should return all orders for a given user ID', async () => {
   //    const response = await request(app)
   //       .get(`/api/v1/orders/${userId}/get-orders`)
   //       .set("Authorization", "Bearer " + token);
      
   //    expect(response.status).toBe(200);
   // });
});