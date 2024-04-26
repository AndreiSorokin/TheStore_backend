import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';

it('should refresh access token successfully', async () => {
   const refreshToken = jwt.sign({ email: 'test@example.com', id: '123' }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '20d' });

   const response = await request(app)
      .post('/api/v1/users/refreshToken')
      .set('Cookie', [`refreshToken=${refreshToken}`]);

   expect(response.status).toBe(200);
   expect(response.body).toHaveProperty('accessToken');
});