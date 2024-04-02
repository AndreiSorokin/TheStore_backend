import request from "supertest";
import connect, { MongoHelper } from "../db-helper";

import app from "../../src/app";
import productServices from "../../src/services/products"
import Product from"../../src/models/Product"

async function createProduct() {
   const product = new Product({ name: "Name", price: 111, description: "description", category: "category1", image: "img1", size: "Large" });
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
})
