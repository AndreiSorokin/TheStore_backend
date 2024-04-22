import mongoose from 'mongoose';
import connect, { MongoHelper } from "../db-helper";
import cartServices from "../../src/services/cart";
import User from "../../src/models/User";
import Product from "../../src/models/Product";
import Category from "../../src/models/Category";

describe('cart services test', () => {
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

   const createUser = async () => {
      const user = new User({
         username: "testUser",
         email: "test@example.com",
         password: "password123",
      });
      await user.save();
      return user;
   };

   const createCategory = async () => {
      const category = new Category({
          name: "categoryName",
          image: "img",
      });
      await category.save();
      return category;
  };

  const createProduct = async (categoryId: mongoose.Types.ObjectId) => {
   const product = new Product({
       name: "Test Product",
       price: 100,
       gender: "Male",
       size: "Medium",
       category: categoryId,
       description: "A test product description",
   });
   await product.save();
   return product;
};

   it("should add a product to a new cart for an existing user", async () => {
      const user = await createUser();
      const category = await createCategory();
      const product = await createProduct(category._id);

      const cart = await cartServices.addProductToCart(user._id, product._id, 1);

      expect(cart).toBeDefined();
      expect(cart.cartItems.some(item => item.productId.equals(product._id))).toBeTruthy();
   });

   it("should retrieve a user's cart with populated cartItems", async () => {
      const user = await createUser();
      const category = await createCategory();
      const product = await createProduct(category._id);
   
      await cartServices.addProductToCart(user._id, product._id, 1);
   
      const cart = await cartServices.getCartByUserId(user._id);
   
      expect(cart).toBeDefined();
   });
});