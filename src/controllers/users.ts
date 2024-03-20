import express, { Request, Response } from "express";
import Product from "../models/Product"
import userService from "../services/user"
import ProductModel, { ProductDocument } from "../models/Product";
import User, { UserDocument } from "../models/User";
export async function getAllUser(_: Request, response: Response) {
   const users = await userService.getAllUser()
   if(users.length===0){
      return response.status(404).json({ message: "Empty User List" });
   }else{
      response.status(200).json(users)
   }
   
}

export async function getSingleUser(request: Request, response: Response) {
   const user = await userService.getSingleUser(request.params.id)
   if(!user) {
      return response.status(404).json({ message: "User not found" });
   }
      return response.status(201).json(user)
}

export async function createUser(request: Request, response: Response) {
   const data = await userService.createUser(new User(request.body))
   if (typeof data === 'string') {
    return response.status(404).json({ message: data });
   }
   response.status(201).json(data);
}

export async function updateUser(request: Request, response: Response) {
   const id = request.params.id;
   const user: Partial<UserDocument> = request.body;

   const updateUser: UserDocument | null = await userService.updateUser(id, user);

   if (!updateUser) {
      return response.status(404).json({ message: "User not found" });
   }

   response.status(200).json(updateUser);
}

export async function deleteUser(request: Request, response: Response) {
   const id = request.params.id;

   const data = await userService.deleteUser(id)

   response.status(200).json({  message:" User deleted" }).end()
}   