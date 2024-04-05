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

export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export type UserToRegister = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type User = UserToRegister & {
  role: Role;
  resetToken?: string | null;
  resetTokenExpiresAt?: Date | null;
  orders: Order[];
};

export type Payload = {
  email: string;
  _id: string;
};
