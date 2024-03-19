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
});


// create category || muzahid
router.post('/', (req: Request, res: Response) => {
   const body: Category = req.body;
   try{
      const newCategory: Category = {
         // Since we don't have DB yet let ID be like this
         id: (categories.length + 1).toString(),
         name: body.name,
      };

      if(!body.name) {
         return res.status(400).json({ msg: "fill out all the fields" })
      }
      if (categories.some(categories => categories.name === body.name)) {
         return res.status(400).json({ msg: "Categori with this name already exists!" });
      }

      categories.push(newCategory)
      res.status(201).json({'success': true, 'msg': 'Category Added Successful', data: categories});
   } catch (error: any) {
      res.status(500).send({'success': false, 'msg': error.message});
   }
})

export default router