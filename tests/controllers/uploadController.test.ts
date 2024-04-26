import request from 'supertest';
import app from '../../src/app'; 
import { uploadImageToCloudinary } from '../../src/services/uploads';

jest.mock('../../src/services/uploads', () => ({
  uploadImageToCloudinary: jest.fn(),
}));

describe('uploadImage Controller', () => {
   const filePath = `${__dirname}/assets/cakeBoy.png`;
  it('should return the image URL on successful upload', async () => {
    (uploadImageToCloudinary as jest.Mock).mockResolvedValue('http://example.com/image.jpg');

    const res = await request(app)
      .post('/api/v1/uploads')
      .attach('image', filePath, 'cakeBoy.png');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ imageUrl: 'http://example.com/image.jpg' });
  });
});