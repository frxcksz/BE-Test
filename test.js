const request = require('supertest');
const app = require('./server');

describe('Test API', () => {
    it('should return "Hello" when GET request is made to "/"', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({message: 'Hello'});
    })
})