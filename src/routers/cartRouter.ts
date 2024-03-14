import express, { Request, Response } from "express";
import { Cart } from "../misc/types"

const router = express.Router();


let cart: Cart = {
   items: [],
   quantity: 0
};

router.delete("/:productId", (request: Request, response: Response) => {
   const productId: string = request.params.productId;

   cart.items = cart.items.filter(item => item.id !== productId);
   
   response.sendStatus(204);
});


export default router