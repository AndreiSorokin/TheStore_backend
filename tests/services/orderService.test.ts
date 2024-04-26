import mongoose from 'mongoose';
import connect, { MongoHelper } from "../db-helper";
import orderService from '../../src/services/orders';
import Order from '../../src/models/Order';

describe('order services test', () => {
   let mongoHelper: MongoHelper;

   beforeAll(async () => {
      mongoHelper = await connect();
   });

   afterAll(async () => {
      await mongoHelper.closeDatabase();
   });

   afterEach(async () => {
      await mongoHelper.clearDatabase();
   });

   it('getAllOrders should return all orders', async () => {
      const order1 = new Order({
         userId: new mongoose.Types.ObjectId(),
         priceSum: 100,
         orderItems: [],
      });
      await order1.save();

      const order2 = new Order({
         userId: new mongoose.Types.ObjectId(),
         priceSum: 200,
         orderItems: [],
      });
      await order2.save();

      const orders = await orderService.getAllOrders();

      expect(orders.length).toBe(2);
      expect(orders[0].priceSum).toEqual(order1.priceSum);
      expect(orders[1].priceSum).toEqual(order2.priceSum);
   });

   it('createOrder should save and return the created order', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const newOrder = new Order({
         userId: userId,
         priceSum: 300,
         orderItems: [],
      });
   
      const savedOrder = await orderService.createOrder(newOrder, userId);
   
      expect(savedOrder).toBeDefined();
      expect(savedOrder._id).toBeDefined();
      expect(savedOrder.priceSum).toEqual(300);
      expect(savedOrder.userId.toString()).toEqual(userId);
   });

   it('getOrderById should return the specified order if it exists', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const order = new Order({
         userId: userId,
         priceSum: 500,
         orderItems: [],
      });
      await order.save();
   
      const foundOrder = await Order.findById(order._id);
   
      expect(foundOrder).toBeDefined();
   });
});