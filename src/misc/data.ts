import { OrderList, Size } from "./types";

export const orders: OrderList[] = [
  {
    id: "1",
    userId: "1",
    createdAt: new Date(),
    priceSum: 3,
    orderItems: [
      {
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
      },
    ],
  },
  {
    id: "2",
    userId: "2",
    createdAt: new Date(),
    priceSum: 3,
    orderItems: [
      {
        id: "2",
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
      },
    ],
  },
  {
    id: "3",
    userId: "3",
    createdAt: new Date(),
    priceSum: 3,
    orderItems: [
      {
        id: "3",
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
      },
    ],
  },
];
