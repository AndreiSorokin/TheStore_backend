export enum Size {
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
}

export type Category = {
  id: string;
  name: string;
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

export type Order = {
  id: string;
  quantity: number;
  priceSum: number;
  products: Product[];
};

export type OrderList = {
  id: string;
  userId: User["id"];
  createdAt: Date;
  priceSum: number;
  orderItems: Order[];
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type UserToRegistar = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
};
