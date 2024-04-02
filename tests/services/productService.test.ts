import request from "supertest";
import connect, { MongoHelper } from "../db-helper";

import app from "../../src/app";
import productServices from "../../src/services/products"
import Product from"../../src/models/Product"

async function createProduct() {
   const product = new Product({ 
      name: "name1", 
      price: 111, 
      description: "description", 
      category: "Clothes", 
      image: "img1", 
      size: "Large" 
   });
   return await productServices.createProduct(product);
}

describe('products services test', () => {
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

   it("should return a list of products", async() => {
      await createProduct()

      const productList = await productServices.getAllProducts(10, 0);
      expect(productList.length).toEqual(1);
      expect(productList[0]).toHaveProperty("Name");
   })

   // it("should create a product", async () => {
   //    const newProduct = await createProduct();
   //    expect(newProduct).toHaveProperty("_id");
   //    expect(newProduct).toHaveProperty("name");
   // });
})
