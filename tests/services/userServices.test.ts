import connect, { MongoHelper } from "../db-helper";
import * as bcrypt from 'bcrypt';
import request from "supertest";
import app from "../../src/app";
import User from "../../src/models/User";
import Order from "../../src/models/Order";
import { createUser, getToken } from "../common/common";
import { Role, UserStatus } from "../../src/misc/types";
import Cart from "../../src/models/Cart";
import userService from "../../src/services/user"

describe('user services test', () => {
   let mongoHelper: MongoHelper;

   beforeAll(async () => {
      mongoHelper = await connect();
   });

   afterAll(async () => {
      await mongoHelper.closeDatabase();
   });

   afterEach(async () => {
      await mongoHelper.clearDatabase();
   });

   test('getAllUser retrieves all users', async () => {
      await createUser(
         'userName',
         'password',
         'firstName',
         'lastName',
         'email@email.email',
         Role.ADMIN,
      )

      const response = await request(app).get('/api/v1/users');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
   });

   test("Should retrieve a single user successfully", async () => {
   const user = await createUser("testUser", "testPass", "Test", "User", "testuser@test.com", Role.ADMIN);
   const loginResponse = await getToken("testuser@test.com", "testPass");
   const token = loginResponse.body.token;
   const userId = user.body.newUser.id;

   const response = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

   expect(response.status).toBe(201);
   expect(response.body).toHaveProperty('id', userId);
   });

   test("createUser should successfully create a new user", async () => {
     const userData = {
       username: "newUser",
       password: "newPassword",
       firstName: "New",
       lastName: "User",
       email: "test@test.com",
       role: Role.ADMIN,
     };
   
     const user = new User(userData);
     const userCreationResponse = await userService.createUser(user);
   
     expect(userCreationResponse).toHaveProperty('email', userData.email);
   });

   test('should update a user successfully', async () => {
      const newUser = new User({
        username: 'testUser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });
      const savedUser = await newUser.save();
  
      const updateData = { firstName: 'UpdatedName' };
  
      const updatedUser = await userService.updateUser(savedUser._id.toString(), updateData);
  
      expect(updatedUser).toBeDefined();
      expect(updatedUser.firstName).toBe(updateData.firstName);
   });

   test('should update the user password successfully', async () => {
      const newUser = new User({
        username: 'passwordUser',
        email: 'password@example.com',
        password: 'oldPassword123',
        firstName: 'Password',
        lastName: 'User'
      });
      const savedUser = await newUser.save();
  
      const newPassword = 'newSecurePassword123';
  
      const updatedUser = await userService.updatePassword(savedUser, newPassword);
  
      const isMatch = await bcrypt.compare(newPassword, updatedUser.password);
      expect(isMatch).toBe(true);
  
      expect(updatedUser.resetToken).toBeNull();
      expect(updatedUser.resetTokenExpiresAt).toBeNull();
   });

   test('should delete a user successfully', async () => {
      const newUser = new User({
        username: 'deleteUser',
        email: 'delete@example.com',
        password: 'password123',
        firstName: 'Delete',
        lastName: 'User'
      });
      const savedUser = await newUser.save();
  
      const deletedUser = await userService.deleteUser(savedUser.id.toString());
  
      expect(deletedUser).toBeDefined();
      expect(deletedUser.id.toString()).toBe(savedUser.id.toString());
  
      const userFound = await User.findById(savedUser.id);
      expect(userFound).toBeNull();
   });

   test('should retrieve a user by email successfully', async () => {
      const newUser = new User({
        username: 'emailUser',
        email: 'test@test.com',
        password: 'password123',
        firstName: 'Email',
        lastName: 'User'
      });
      await newUser.save();
    
      const foundUser = await userService.getUserByEmail('test@test.com');
    
      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe('test@test.com');
   });

   test('should retrieve a user by reset token successfully', async () => {
      const newUser = new User({
        username: 'resetTokenUser',
        email: 'reset@example.com',
        password: 'password123',
        firstName: 'Reset',
        lastName: 'Token',
        resetToken: 'someResetToken123'
      });
      await newUser.save();
    
      const foundUser = await userService.getUserByResetToken('someResetToken123');
    
      expect(foundUser).toBeDefined();
      expect(foundUser.resetToken).toBe('someResetToken123');
   });

   test('should successfully update user role to admin', async () => {
      const newUser = new User({
        username: 'regularUser',
        email: 'user@example.com',
        password: 'password123',
        firstName: 'Regular',
        lastName: 'User',
        role: Role.CUSTOMER
      });
      const savedUser = await newUser.save();
    
      const updatedUser = await userService.assingAdmin(savedUser.id.toString(), { role: Role.ADMIN });
    
      expect(updatedUser).toBeDefined();
      expect(updatedUser.role).toBe(Role.ADMIN);
   });

   test('should successfully update user role from admin to customer', async () => {
     const newUser = new User({
       username: 'adminUser',
       email: 'admin@example.com',
       password: 'password123',
       firstName: 'Admin',
       lastName: 'User',
       role: Role.ADMIN
     });
     const savedUser = await newUser.save();
   
     const updatedUser = await userService.removeAdmin(savedUser.id.toString(), { role: Role.CUSTOMER });
   
     expect(updatedUser).toBeDefined();
     expect(updatedUser.role).toBe(Role.CUSTOMER);
   });

   test('updateUserStatus should successfully update user status', async () => {
      const newUser = new User({
        username: 'statusUser',
        email: 'status@example.com',
        password: 'password123',
        firstName: 'Status',
        lastName: 'User',
        status: UserStatus.INACTIVE
      });
      const savedUser = await newUser.save();
    
      const updatedUser = await userService.updateUserStatus(savedUser.id.toString(), { status: UserStatus.ACTIVE });
    
      expect(updatedUser).toBeDefined();
      expect(updatedUser.status).toBe(UserStatus.ACTIVE);
   });

   test('findOrCreate should find an existing user by email', async () => {
      const existingUser = new User({
        email: 'existing@example.com',
        password: 'password123',
        username: 'existingUser',
        firstName: 'Existing',
        lastName: 'User',
      });
      await existingUser.save();
    
      const foundUser = await userService.findOrCreate({ email: 'existing@example.com' });
    
      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe('existing@example.com');
   });
});