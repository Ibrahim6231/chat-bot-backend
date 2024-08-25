const request = require('supertest');
const express = require('express');
const GroupRoutes = require('../../dist/routes/group/route'); // Adjust path to your compiled JavaScript output
const { Status } = require('../../dist/enum/httpStatus'); // Adjust path as needed

const app = express();
app.use(express.json());
app.post('/create-group', GroupRoutes.createGroup); // Adjust path to your controller

describe('POST /create-group', () => {
  it('should create a group successfully', async () => {
    const groupData = {
      name: 'Test Group',
      adminId: '12345',
      members: ['user1', 'user2']
    };

    const response = await request(app)
      .post('/create-group')
      .send(groupData);

    expect(response.status).toBe(Status.OK);
    expect(response.body).toEqual({
      code: Status.OK,
      data: expect.objectContaining(groupData),
    });
  });

  it('should return 400 if validation fails', async () => {
    const groupData = {
      name: '',
      adminId: '12345',
      members: ['user1', 'user2']
    };

    const response = await request(app)
      .post('/create-group')
      .send(groupData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation error');
  });
});
