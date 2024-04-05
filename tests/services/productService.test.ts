import connect, { MongoHelper } from "../db-helper";

import productServices from "../../src/services/products";
import { createProduct } from "../common/common";

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

   it("should create a product", async () => {
      const product = await createProduct();
      expect(product).toHaveProperty("_id")
   })

   it("should return a list of products", async() => {
         await createProduct();

         const productList = await productServices.getAllProducts(10, 0);

         expect(productList.length).toEqual(1);
         expect(productList[0]).toHaveProperty("name", "name1");
   })
})


