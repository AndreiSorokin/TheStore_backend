import request from "supertest";
import connect, { MongoHelper } from "../db-helper";
import app from '../../src/app';
import { createUser, registerAndLoginAdmin } from "../common/common";
import { Role, UserStatus } from "../../src/misc/types";


describe('User controller', () => {
   let mongoHelper: MongoHelper;
   let admintoken: string;
   let userId: number;

   beforeAll(async () => {
      mongoHelper = await connect();

      admintoken = await registerAndLoginAdmin();

      const user = await createUser("testUser", "testPass", "Test", "User", "testuser@gmail.com", Role.ADMIN);
      userId = user.body.newUser.id;
      console.log('loginResponse.body1', user.body.newUser);

      // const customer = await createUser("testUser", "testPass", "Test", "User", "testuser2@gmail.com", Role.CUSTOMER);
      // const loginResponse = await request(app)
      // .post('/api/v1/users/login')
      // .send({ email: customer.body.newUser.email, password: 'password' });
      // console.log('loginResponse.body1', loginResponse.body.newUser);
   });

   afterAll(async () => {
      await mongoHelper.closeDatabase();
   });

   it('should return 200 and a list of users if users exist', async () => {
      const res = await request(app).get('/api/v1/users')
      .set("Authorization", admintoken);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
   });

   it('should return 201 and the user object if the user exists', async () => {
      const res = await request(app)
            .get(`/api/v1/users/${userId}`)
            .set("Authorization", admintoken);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id', userId);
   });

   it('should create a new user', async () => {
      const userData = {
         username: 'testUser',
         password: 'password123',
         firstName: 'Test',
         lastName: 'User',
         email: 'test@gmail.com',
      };
      
      const response = await request(app)
         .post('/api/v1/users')
         .set("Authorization", admintoken)
         .send(userData);

      expect(response.statusCode).toBe(201);
   });

   it('should update a user', async () => {
      const updatedUserData = {
        username: 'updatedTestUser',
        firstName: 'UpdatedTest',
        lastName: 'UpdatedUser',
        email: 'updatedtestuser@gmail.com',
      };
  
      const response = await request(app)
        .put(`/api/v1/users/${userId}`)
        .set("Authorization", admintoken)
        .send(updatedUserData);
  
      expect(response.statusCode).toBe(200);
   });

   it('should successfully update the password', async () => {
      const response = await request(app)
          .put(`/api/v1/users/${userId}/update-password`)
          .set("Authorization", admintoken)
          .send({
              oldPassword: 'testPass',
              newPassword: 'newPassword'
          });

      expect(response.statusCode).toBe(201);
   });

   it('should delete a user', async () => {
      const res = await request(app)
          .delete(`/api/v1/users/${userId}`)
          .set("Authorization", admintoken)

      expect(res.statusCode).toEqual(204);
   });

   it('should login successfully', async () => {
      const registerResponse = await request(app)
        .post('/api/v1/users/registration')
        .send({ 
            username: "username",
            password: "password",
            firstName: "firstName",
            lastName: "lastName",
            email: "email2@gmail.com",
        });

        expect(registerResponse.statusCode).toBe(201);

    const loginResponse = await request(app)
        .post('/api/v1/users/login')
        .send({ email: registerResponse.body.newUser.email, password: 'password' });

      expect(loginResponse.statusCode).toBe(200);
   });

   it('should send a verification email if email is valid', async () => {
      const registerResponse = await request(app)
        .post('/api/v1/users/registration')
        .send({ 
            username: "username",
            password: "password",
            firstName: "firstName",
            lastName: "lastName",
            email: "email3@gmail.com",
        });

        expect(registerResponse.statusCode).toBe(201);
  
      const response = await request(app)
        .post('/api/v1/users/forgot-password')
        .send({ email: registerResponse.body.newUser.email });
  
      expect(response.status).toBe(200);
   });

   it('should assign the admin role to a user', async () => {
      const customer = await createUser("testUser", "testPass", "Test", "User", "testuser2@gmail.com", Role.CUSTOMER);
      const customerId = customer.body.newUser.id;

      const newRole = { role: Role.ADMIN };
  
      const response = await request(app)
        .put(`/api/v1/users/${customerId}/userInformation`)
        .set("Authorization", admintoken)
        .send(newRole);
  
      expect(response.statusCode).toBe(200);
   });

   it('should remove the admin role to a user', async () => {
      const newAdmin = await createUser("testUser", "testPass", "Test", "User", "testuser3@gmail.com", Role.ADMIN);
      const newAdminId = newAdmin.body.newUser.id;

      const newRole = { role: Role.CUSTOMER };
  
      const response = await request(app)
        .put(`/api/v1/users/${newAdminId}/userInformation`)
        .set("Authorization", admintoken)
        .send(newRole);
  
      expect(response.statusCode).toBe(200);
   });

   it('should assign the admin role to a user', async () => {
      const customer = await createUser("testUser", "testPass", "Test", "User", "testuser4@gmail.com", Role.CUSTOMER);
      const customerId = customer.body.newUser.id;
      const newStatus = {userId: customerId, status: UserStatus.INACTIVE };
  
      const response = await request(app)
        .post(`/api/v1/users/changeUserStatus`)
        .set("Authorization", admintoken)
        .send(newStatus);

      expect(response.statusCode).toBe(200);
   });
});