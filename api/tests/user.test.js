const supertest = require('supertest');
const app = require('./base/startup');
const mongoose = require('mongoose');

const request = supertest(app);

describe('User Endpoints', () => {
  beforeAll(async done => {
    await mongoose.connection.collection('users').deleteMany({});
    done()
  });

  afterAll(async done => {
    await mongoose.connection.close()
    done()
  });

  // POST /api/users
  it('missing all body params', async done => {
    const newUser = await request
      .post('/api/users')
      .send({});

    expect(newUser.statusCode).toBe(422);
    expect(newUser.body).toHaveProperty('error')
    done();
  });

  it('missing email, password and type', async done => {
    const newUser = await request
      .post('/api/users')
      .send({
        name: "The little test"
      });

    expect(newUser.statusCode).toBe(422);
    expect(newUser.body).toHaveProperty('error')
    done();
  });

  it('missing password and type', async done => {
    const newUser = await request
      .post('/api/users')
      .send({
        name: "The little test",
        email: "test@test.com"
      });

    expect(newUser.statusCode).toBe(422);
    expect(newUser.body).toHaveProperty('error')
    done();
  });

  it('missing type', async done => {
    const newUser = await request
      .post('/api/users')
      .send({
        name: "The little test",
        email: "test@test.com",
        password: "123456789"
      });

    expect(newUser.statusCode).toBe(422);
    expect(newUser.body).toHaveProperty('error')
    done();
  });

  it('wrong type', async done => {
    const newUser = await request
      .post('/api/users')
      .send({
        name: "The little test",
        email: "test@test.com",
        password: "123456789",
        type: "blabla"
      });

    expect(newUser.statusCode).toBe(422);
    expect(newUser.body).toHaveProperty('error')
    done();
  });

  it('wrong email format', async done => {
    const newUser = await request
      .post('/api/users')
      .send({
        name: "The little test",
        email: "test",
        password: "123456789",
        type: "professional"
      });

    expect(newUser.statusCode).toBe(422);
    expect(newUser.body).toHaveProperty('error')
    done();
  });

  it('all ok', async done => {
    const newUser = await request
      .post('/api/users')
      .send({
        name: "The little test",
        email: "test@test.com",
        password: "123456789",
        type: "professional"
      });

    expect(newUser.statusCode).toBe(201);
    done();
  });

  // POST api/users/login
  it('missing login body params', async done => {
    const newUser = await request
      .post('/api/users/login')
      .send({});

      expect(newUser.statusCode).toBe(422);
      expect(newUser.body).toHaveProperty('error');
      done();
  }); 

  it('missing login password param', async done => {
    const newUser = await request
      .post('/api/users/login')
      .send({
        email: "test@test.com"
      });

      expect(newUser.statusCode).toBe(422);
      expect(newUser.body).toHaveProperty('error');
      done();
  }); 

  it('wrong login email param', async done => {
    const newUser = await request
      .post('/api/users/login')
      .send({
        email: "test",
        password: "123456789"
      });

      expect(newUser.statusCode).toBe(422);
      expect(newUser.body).toHaveProperty('error');
      done();
  }); 

  it('invalid email or password', async done => {
    const loginUser = await request
      .post('/api/users/login')
      .send({
        email: "test2@test.com",
        password: "123456789"
      });

      expect(loginUser.statusCode).toBe(401);
      expect(loginUser.body).toHaveProperty('error');
      done();
  }); 

  it('all ok', async done => {
    const loginUser = await request
      .post('/api/users/login')
      .send({
        email: "test@test.com",
        password: "123456789"
      });

      expect(loginUser.statusCode).toBe(201);
      expect(loginUser.body).toHaveProperty('data');
      done();
  }); 
});