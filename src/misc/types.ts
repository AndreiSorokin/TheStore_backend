import { Types } from "mongoose";

export enum Size {
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
}

export enum Gender {
  Male = "Male",
  Female = "Female"
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
  images: [string];
  size: Size;
  gender: Gender;
};

export type OrderItem = {
  quantity: number;
  productId: Types.ObjectId;
};

export type Order = {
  id: number;
  userId: Types.ObjectId;
  createdAt: Date;
  shipment: string;
  priceSum: number;
  orderItems: OrderItem[];
};

export type Cart = {
  id: number;
  userId: Types.ObjectId;
  priceSum: number;
  cartItems: OrderItem[];
}

export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}


export type UserToRegister = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
};

export type User = UserToRegister & {
  status:UserStatus;
  role: Role;
  resetToken?: string | null;
  resetTokenExpiresAt?: Date | null;
  orders?: Order[];
  cart?: Cart[];
};


export type Payload = {
  email: string;
  _id: string;
};

export type loginPayload = {
  email: string;
  password: string;
};

