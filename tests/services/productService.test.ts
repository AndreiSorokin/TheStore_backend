import request from "supertest";
import connect, { MongoHelper } from "../db-helper";

import productServices from "../../src/services/products";
import categoryServices from "../../src/services/category";
import Product from "../../src/models/Product";
import Category from "../../src/models/Category";

async function createCategory() {
   const category = new Category({
      name: "Clothes",
      image: "img.png",
   });
   return await categoryServices.createCategory(category);
}

async function createProduct() {
   const category = await createCategory();

   const product = new Product({ 
      name: "name1", 
      price: 111, 
      description: "description", 
      category: category._id, 
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
         const createdProduct = await createProduct();
         console.log("Created Product:", createdProduct);

         const productList = await productServices.getAllProducts(10, 0);
         console.log("Product List:", productList);

         expect(productList.length).toEqual(1);
         expect(productList[0]).toHaveProperty("name", "name1");
   })
})


