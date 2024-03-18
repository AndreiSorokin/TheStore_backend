import express, { Request, Response } from "express";
import { Order, Size } from "../misc/types";
import { orders } from "../misc/data";

const router = express.Router();

// Lam

// get all orders
router.get("/", (request: Request, response: Response) => {
  const userId = request.query.id as string;
  let newOrders;

  if (userId) {
    newOrders = orders.filter((order) =>
      order.id.toLowerCase().includes(userId)
    );
  }

  response.status(200).json(newOrders);
});

// create order
router.post("/", (request: Request, response: Response) => {
  const body = request.body;
  let newOrders = [];
  //   example
  const newOrder: Order = {
    id: "1",
    quantity: 2,
    priceSum: 3,
    products: [
      {
        id: "2",
        name: "order2",
        price: 2,
        description: "description2",
        category: { id: "2", name: "category2" },
        size: Size.Medium,
      },
      {
        id: "3",
        name: "order3",
        price: 3,
        description: "description3",
        category: { id: "3", name: "category3" },
        size: Size.Large,
      },
    ],
  };
  newOrders = [...orders];
  newOrders.push(body);
  response.status(201).json(newOrders);
});

//  get single order
router.get("/:orderId", (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const index = orders.findIndex((order) => order.id === id);
    let result = {};
    if (index !== -1) {
      result = {
        success: true,
        msg: "Order Get Successful",
        data: orders[index],
      };
    } else {
      result = { success: false, msg: "Order Info not Found", data: [] };
    }
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).send({ success: false, msg: error.message });
  }
});

// Lam
router.put("/:orderId", (request: Request, response: Response) => {
  const orderId = request.params.orderId;
  let newOrders;
  try {
    const index = orders.findIndex((item) => item.id === orderId);
    if (index !== -1) {
      const newOrder: Order = {
        id: "1",
        quantity: 2,
        priceSum: 3,
        products: [
          {
            id: "2",
            name: "order2",
            price: 2,
            description: "description2",
            category: { id: "2", name: "category2" },
            size: Size.Medium,
          },
          {
            id: "3",
            name: "order3",
            price: 3,
            description: "description3",
            category: { id: "3", name: "category3" },
            size: Size.Large,
          },
        ],
      };

      newOrders = orders.map((order) => {
        if (Number(order.id) === index) {
          return {
            ...order,
            products: [
              {
                id: "4",
                name: "order4",
                price: 2,
                description: "description2",
                category: { id: "2", name: "category2" },
                size: Size.Medium,
              },
              {
                id: "5",
                name: "order5",
                price: 3,
                description: "description3",
                category: { id: "3", name: "category3" },
                size: Size.Large,
              },
            ],
          };
        }
      });

      response.sendStatus(204); // Order updated successfully
    } else {
      response.status(404).json({ success: false, msg: "Order not found" });
    }
  } catch (error: any) {
    response.status(500).send({ success: false, msg: error.message });
  }
});

// delete order
router.delete("/:orderId", (request: Request, response: Response) => {
  const orderId = request.params.orderId;

  try {
    const index = orders.findIndex((item) => item.id === orderId);
    if (index !== -1) {
      orders.splice(index, 1);
      response.sendStatus(204);
    } else {
      response.status(404).json({ success: false, msg: "Order not found" });
    }
  } catch (error: any) {
    response.status(500).send({ success: false, msg: error.message });
  }
});

export default router;
