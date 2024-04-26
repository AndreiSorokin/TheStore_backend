import request from "supertest";
import connect, { MongoHelper } from "../db-helper";
import fs from 'fs';

import app from "../../src/app";
import { createProduct, createUser, getToken, registerAndLoginAdmin } from "../common/common";
import { Gender, Role, Size } from "../../src/misc/types";
import Product from "../../src/models/Product";
import Category from "../../src/models/Category";
import Order from "../../src/models/Order";

describe('order controller test', () => {
   let mongoHelper: MongoHelper;
   let token: string;
   let userId: string;
   let productId: string;
   let categoryId: number;
   let orderId: string;

   const filePath = `${__dirname}/assets/cakeBoy.png`;

   beforeAll(async () => {
      mongoHelper = await connect();
      const user = await createUser("testUser", "testPass", "Test", "User", "testuser@gmail.com", Role.ADMIN);
      userId = user.body.newUser.id;

      token = await registerAndLoginAdmin()

      const order = new Order({userId: userId});
      orderId = order.id;

      const categoryResponse = await request(app)
         .post('/api/v1/categories')
         .set("Authorization", token)
         .field('name', 'name' )
         .attach('image', filePath, 'cakeBoy.png');
      categoryId = categoryResponse.body.id;

      const product = await createProduct();
      productId = product.id;
   });

   afterAll(async () => {
      await Order.findByIdAndDelete(orderId);
      await mongoHelper.closeDatabase();
   });

   it('should return all orders', async () => {
      const response = await request(app)
         .get('/api/v1/orders')
         .set("Authorization", token)
      expect(response.status).toBe(200);
   });

   it('should return all orders for a given user ID', async () => {
      const response = await request(app)
         .get(`/api/v1/orders/${userId}/get-orders`)
         .set("Authorization", token)
      
      expect(response.status).toBe(200);
   });
});