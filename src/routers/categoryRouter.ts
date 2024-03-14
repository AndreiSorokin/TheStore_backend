import express, { Request, Response } from "express";
import { Category } from "../misc/types"

const router = express.Router();


let categories: Category[]  = [
   { id: '1', name: 'name1' },
   { id: '2', name: 'name2' },
   { id: '3', name: 'name3' },
]

router.get('/', (req: Request, res: Response) => {
   res.status(200).json(categories);
})

export default router