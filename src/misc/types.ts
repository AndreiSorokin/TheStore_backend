export enum Size {
   Small = "Small",
   Medium = "Medium",
   Large = "Large",
}

export type Category = {
   id: string;
   name: string;
}

export type Product = {
   id: string;
   name: string;
   price: number;
   description: string;
   category: Category;
   size: Size;
}

export type Cart = {
   items: Product[];
   quantity: number;
}

export type User = {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
}

export type UserToRegistar = {
   username: string;
   password: string;
   firstName: string;
   lastName: string;
   email: string;
}