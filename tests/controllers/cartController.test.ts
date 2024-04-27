import request from 'supertest';
import app from '../../src/app';
import User from '../../src/models/User';
import Cart from '../../src/models/Cart';
import connect, { MongoHelper } from "../db-helper";
import Product from '../../src/models/Product';
import { Gender, Size } from '../../src/misc/types';
import Category from '../../src/models/Category';

describe('cart controller test', () => {
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

  it('should return 200 and the cart for the given user', async () => {
    const newUser = new User({ email: 'test@example.com', password: "123456" });
    await newUser.save();
    const newCart = new Cart({ userId: newUser._id, items: [], total: 0 });
    await newCart.save();

    const response = await request(app).get(`/api/v1/users/${newUser._id}/cart`);
    expect(response.status).toBe(200);
  });

  it('should add a product to the user cart successfully', async () => {
    const newUser = new User({ email: 'user@example.com', password: "password" });
    await newUser.save();
  

const newCategory = new Category({
  name: 'Test Category',
  image: '../assets/cakeBoy.png',
});
await newCategory.save();

const newProduct = new Product({
  name: 'Test Product',
  price: 10,
  gender: Gender.Male,
  size: Size.Medium,
  category: newCategory._id,
  description: 'A test product description'
});
await newProduct.save();
  
    const bodyData = {
      userId: newUser._id,
      productId: newProduct._id,
      quantity: 1
    };
  
const response = await request(app).post(`/api/v1/products/${newProduct._id}/addToCart`).send(bodyData);  
    expect(response.status).toBe(200);
  });
});