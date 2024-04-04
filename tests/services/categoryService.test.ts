import connect, { MongoHelper } from "../db-helper";

import categoryServices from "../../src/services/category";
import { createCategory, createProduct } from "../common/common";
import Category, { CategoryDocument } from "../../src/models/Category";

describe('Category services test', () => {
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

   it("should return a list of categories", async () => {
         await createCategory();

         const categoryList = await categoryServices.getAllCategory();

         expect(categoryList.length).toEqual(1);
         expect(categoryList[0]).toHaveProperty("name", "Clothes");
   })

   it("should return a single category", async () => {
      const createdCategory = await createCategory();

         const categoryId = createdCategory._id;

         const result = await categoryServices.getOneCategory(categoryId);

         expect(result).toHaveProperty("name", "Clothes");
   })

   it("should create a category", async () => {
      const category = await createCategory();
      expect(category).toHaveProperty("_id")
   })

   it("should update a category", async () => {
      const originalCategory: CategoryDocument = new Category({
         name: "Original Category",
         image: "original-image.jpg"
      });
      await originalCategory.save();

      const changedCategory: Partial<CategoryDocument> = {
         name: "Updated Category",
         image: "updatedImage.jpg"
      };

      const updatedCategory = await categoryServices.updateCategory(originalCategory._id, changedCategory);

      expect(updatedCategory).toBeDefined();

      expect(updatedCategory?._id).toEqual(originalCategory._id);
      expect(updatedCategory?.name).toEqual(changedCategory.name);
      expect(updatedCategory?.image).toEqual(changedCategory.image);
   });

   it("should delete a category", async () => {
      const mockCategory: CategoryDocument = new Category({
         name: "Category",
         image: "image.jpg"
      });
      await mockCategory.save();

      const deletedCategory = await categoryServices.deleteCategory(mockCategory._id);

      expect(deletedCategory).toBeDefined();
      expect(deletedCategory?._id).toEqual(mockCategory._id);

      const categoryInDB = await Category.findById(mockCategory._id);
      expect(categoryInDB).toBeNull();
   });
})
