import express, { Request, Response } from "express";
import { Size, Category, Product } from "../misc/types"

const router = express.Router();


let products: Product[] = [
  { id: "1", name: "product1", price: 1, description: "description1", category: { category: "category1" }, size: Size.Small },
  { id: "2", name: "product2", price: 2, description: "description2", category: { category: "category2" }, size: Size.Medium },
  { id: "3", name: "product3", price: 3, description: "description3", category: { category: "category3" }, size: Size.Large },
];

router.get("/", (request: Request, response: Response) => {
  const nameQuery = request.query.name as string;
  const priceQuery = request.query.price as string;
  const categoryQuery = request.query.category as string;

  if (nameQuery) {
    products = products.filter(product =>
      product.name.toLowerCase().includes(nameQuery.toLowerCase())
    );
  }

  if (priceQuery) {
    const price = parseFloat(priceQuery);
    products = products.filter(product =>
      product.price === price
    );
  }

  if (categoryQuery) {
    products = products.filter(product =>
      product.category.category.includes(categoryQuery)
    );
  }

  response.status(200).json(products);
});


router.post("/", (request: Request, response: Response) => {
  const body = request.body
  const newProduct: Product = {
    // Since we don't have DB yet let ID be like this
    id: (products.length + 1).toString(),
    name: body.name,
    price: body.price,
    description: body.description,
    category: body.category,
    size: body.size
  }

  if(!body.name || !body.price || !body.description || !body.category || !body.size) {
    return response.status(400).json({ message: "fill out all the fields" })
}

  products.push(newProduct);
  response.status(201).json(products);
});


router.delete("/:productId", (request: Request, response: Response) => {
  const productId = request.params.productId;
  products = products.filter((item) => item.id !== productId);
  response.sendStatus(204);
});

export default router;