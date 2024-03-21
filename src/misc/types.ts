import { Types } from "mongoose";

export enum Size {
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
}

export type Category = {
  id: string;
  name: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  image: string;
  size: Size;
};


export type OrderItem = {
  quantity: number;
  productId: Types.ObjectId;
};

export type Order = {
  userId: Types.ObjectId;
  createdAt: Date;
  shipment: string;
  priceSum: number;
  orderItems: OrderItem[];
};

export type User = {
  id: Types.ObjectId;
  name: string;
  email: number;
  password: string;
  role: string;
};

export type UserToRegistar = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
};
