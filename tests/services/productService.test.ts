import connect, { MongoHelper } from "../db-helper";
import request from "supertest";
import app from "../../src/app";

import productServices from "../../src/services/products";
import { createProduct } from "../common/common";
import Product from "../../src/models/Product";

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
      expect(product).toHaveProperty("id")
   })

   it("should return a list of products", async() => {
         await createProduct();

         const productList = await productServices.getAllProducts(10, 0);

         expect(productList.length).toEqual(1);
         expect(productList[0]).toHaveProperty("name", "name1");
   })

   it("should return a single product by ID", async () => {
      const product = await createProduct();

      const response = await request(app).get(`/api/v1/products/${product.id}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id", product.id);
      expect(response.body).toHaveProperty("name", product.name);
   });

   it("should update an existing product", async () => {
      const product = await createProduct();

      const changes = {
         name: "Updated Product Name",
         price: 200,
      };

      const updatedProduct = await productServices.updateProduct(product.id, changes);

      expect(updatedProduct).toHaveProperty("id", product.id);
      expect(updatedProduct).toHaveProperty("name", changes.name);
      expect(updatedProduct).toHaveProperty("price", changes.price);

      const fetchedProduct = await Product.findById(product.id);
      expect(fetchedProduct).toHaveProperty("name", changes.name);
      expect(fetchedProduct).toHaveProperty("price", changes.price);
   });

   it("should delete an existing product", async () => {
      const product = await createProduct();

      const deletedProduct = await productServices.deleteProduct(product.id);

      expect(deletedProduct).toHaveProperty("id", product.id);

      const fetchedProduct = await Product.findById(product.id);
      expect(fetchedProduct).toBeNull();
   });
})


