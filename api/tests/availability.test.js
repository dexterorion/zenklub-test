const supertest = require('supertest');
const app = require('./base/startup');
const mongoose = require('mongoose');

const request = supertest(app);
let token = '';
let availabilityId = '';

describe('Availability Endpoints', () => {
  beforeAll(async done => {
    await mongoose.connection.collection('users').deleteMany({});
    await mongoose.connection.collection('availabilities').deleteMany({});

    const newUser = await request
      .post('/api/users')
      .send({
        name: "The little test",
        email: "tologin@test.com",
        password: "123456789",
        type: "professional"
      });

    expect(newUser.statusCode).toBe(201);

    const loginUser = await request
      .post('/api/users/login')
      .send({
        email: "tologin@test.com",
        password: "123456789"
      });

      expect(loginUser.statusCode).toBe(201);
      expect(loginUser.body).toHaveProperty('data');

      token = loginUser.body.data;

    done()
  });

  afterAll(async done => {
    await mongoose.connection.close()
    done()
  });

  it('POST /api/availability - missing auth token', async done => {
    const availability = await request
      .post('/api/availability')
      .send({});

    expect(availability.statusCode).toBe(401);
    expect(availability.body).toHaveProperty('error');

    done()
  });

  it('POST /api/availability - malformed token', async done => {
    const availability = await request
      .post('/api/availability')
      .set('Authorization', 'Bearer blabla')
      .send({});

    expect(availability.statusCode).toBe(401);
    expect(availability.body).toHaveProperty('error');
    expect(availability.body.error).toBe('JsonWebTokenError: jwt malformed');
    done()
  });

  it('POST /api/availability - missing all fields', async done => {
    const availability = await request
      .post('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(availability.statusCode).toBe(422);
    expect(availability.body).toHaveProperty('error');
    done()
  });

  it('POST /api/availability - wrong weekday', async done => {
    const availability = await request
      .post('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
          weekday: 'A day'
      });

    expect(availability.statusCode).toBe(422);
    expect(availability.body).toHaveProperty('error');
    done()
  });

  it('POST /api/availability - all ok', async done => {
    const availability = await request
      .post('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
          weekday: 'Sunday'
      });

    expect(availability.statusCode).toBe(201);
    expect(availability.body).toHaveProperty('data');
    expect(availability.body.data.weekday).toBe('Sunday');
    done()
  });

  it('POST /api/availability - duplicated availability', async done => {
    const availability = await request
      .post('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
          weekday: 'Sunday'
      });

    expect(availability.statusCode).toBe(500);
    expect(availability.body).toHaveProperty('error');
    done()
  });

  it('POST /api/availability - all fields on timeRange object are required', async done => {
    const availability = await request
      .post('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
          weekday: 'Monday',
          timeRange: [
              {}
          ]
      });

    expect(availability.statusCode).toBe(422);
    expect(availability.body).toHaveProperty('error');
    done()
  });

  it('POST /api/availability - all fields on timeRange are ok now', async done => {
    const availability = await request
      .post('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
          weekday: 'Monday',
          timeRange: [
              {
                startHour: 10,
                startMinute: 0,
                endHour: 10,
                endMinute: 0,
              }
          ]
      });

    expect(availability.statusCode).toBe(201);
    expect(availability.body).toHaveProperty('data');
    expect(availability.body.data.weekday).toBe('Monday');
    
    availabilityId = availability.body.data._id
    done()
  });
  
  it('POST /api/availability - second timeRange object is wrong', async done => {
    const availability = await request
      .post('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
          weekday: 'Monday',
          timeRange: [
              {
                startHour: 10,
                startMinute: 0,
                endHour: 10,
                endMinute: 0,
              },
              {}
          ]
      });

    expect(availability.statusCode).toBe(422);
    expect(availability.body).toHaveProperty('error');
    done()
  });

  it('POST /api/availability - first timeRange object has wrong startMinute type', async done => {
    const availability = await request
      .post('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
          weekday: 'Monday',
          timeRange: [
              {
                startHour: 10,
                startMinute: 'ABC',
                endHour: 10,
                endMinute: 0,
              }
          ]
      });

    expect(availability.statusCode).toBe(422);
    expect(availability.body).toHaveProperty('error');
    done()
  });

  it('GET /api/availability/:id - not found availability', async done => {
    const availability = await request
      .get(`/api/availability/5f047376e65a180b11ae17dc`)
      .set('Authorization', `Bearer ${token}`);

    expect(availability.statusCode).toBe(500);
    expect(availability.body).toHaveProperty('error');
    done()
  });

  it('GET /api/availability/:id - found', async done => {
    const availability = await request
      .get(`/api/availability/${availabilityId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(availability.statusCode).toBe(200);
    expect(availability.body).toHaveProperty('data');
    expect(availability.body.data._id).toBe(availabilityId);
    done()
  });

  it('PUT /api/availability/:id - first timeRange object has wrong startMinute type', async done => {
    const availability = await request
      .put(`/api/availability/${availabilityId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
          weekday: 'Monday',
          timeRange: [
              {
                startHour: 10,
                startMinute: 'ABC',
                endHour: 10,
                endMinute: 0,
              }
          ]
      });

    expect(availability.statusCode).toBe(422);
    expect(availability.body).toHaveProperty('error');
    done()
  });

  it('PUT /api/availability/:id - no access to availability', async done => {
    const availability = await request
      .put(`/api/availability/5f047376e65a180b11ae17dc`)
      .set('Authorization', `Bearer ${token}`)
      .send({
          weekday: 'Monday',
          timeRange: [
              {
                startHour: 10,
                startMinute: 0,
                endHour: 10,
                endMinute: 0,
              }
          ]
      });

    expect(availability.statusCode).toBe(500);
    expect(availability.body).toHaveProperty('error');
    done()
  });

  it('PUT /api/availability/:id - all ok', async done => {
    const availability = await request
      .put(`/api/availability/${availabilityId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
          weekday: 'Monday',
          timeRange: [
              {
                startHour: 10,
                startMinute: 0,
                endHour: 10,
                endMinute: 0,
              }
          ]
      });

    expect(availability.statusCode).toBe(204);
    done()
  });

  it('GET /api/availability - get all', async done => {
    const availabilities = await request
      .get(`/api/availability`)
      .set('Authorization', `Bearer ${token}`)
      
    expect(availabilities.statusCode).toBe(200);
    expect(availabilities.body).toHaveProperty('data');
    expect(availabilities.body.data.length).toBe(2);
    done()
  });

  it('GET /api/availability/:userId/slots - no params sent error', async done => {
    const availabilities = await request
      .get(`/api/availability/5f047376e65a180b11ae17dc/slots`)
      
    expect(availabilities.statusCode).toBe(422);
    expect(availabilities.body).toHaveProperty('error');
    done()
  });

  it('GET /api/availability/:userId/slots - wrong format start and end time', async done => {
    const availabilities = await request
      .get(`/api/availability/5f047376e65a180b11ae17dc/slots?weekday=Monday`)
      
    expect(availabilities.statusCode).toBe(422);
    expect(availabilities.body).toHaveProperty('error');
    done()
  });

  it('GET /api/availability/:userId/slots - wrong format start and end time', async done => {
    const availabilities = await request
      .get(`/api/availability/5f047376e65a180b11ae17dc/slots?weekday=Monday&startTime=1000&endTime=1200`)
      
    expect(availabilities.statusCode).toBe(422);
    expect(availabilities.body).toHaveProperty('error');
    done()
  });

  it('GET /api/availability/:userId/slots - availability not found by user', async done => {
    const availabilities = await request
      .get(`/api/availability/5f047376e65a180b11ae17dc/slots?weekday=Monday&startTime=10:00&endTime=12:00`)
      
    expect(availabilities.statusCode).toBe(200);
    expect(availabilities.body).toHaveProperty('data');
    expect(availabilities.body.data.length).toBe(0);
    done()
  });
});