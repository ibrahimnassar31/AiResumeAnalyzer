import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { registerUser, loginUser } from '../../src/services/user.service.js';
import User from '../../src/models/user.model.js';
import bcrypt from 'bcryptjs';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User Service', () => {
  describe('registerUser', () => {
    it('should create and save a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      const user = await registerUser(userData);

      expect(user).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Password should be hashed

      const dbUser = await User.findById(user._id);
      expect(dbUser).toBeDefined();
      expect(dbUser.email).toBe(userData.email);
    });

    it('should throw an error if email already exists', async () => {
      const userData = {
        username: 'testuser1',
        email: 'test@example.com',
        password: 'password123',
      };
      await registerUser(userData);

      const duplicateUserData = {
        username: 'testuser2',
        email: 'test@example.com',
        password: 'password123',
      };
      await expect(registerUser(duplicateUserData)).rejects.toThrow('User already exists');
    });

    it('should throw an error if username already exists', async () => {
      const userData = {
        username: 'testuser',
        email: 'test1@example.com',
        password: 'password123',
      };
      await registerUser(userData);

      const duplicateUserData = {
        username: 'testuser',
        email: 'test2@example.com',
        password: 'password123',
      };
      await expect(registerUser(duplicateUserData)).rejects.toThrow('User already exists');
    });
  });

  describe('loginUser', () => {
    const userData = {
      username: 'loginuser',
      email: 'login@example.com',
      password: 'password123',
    };

    beforeEach(async () => {
      // Register a user to be used for login tests
      await registerUser(userData);
    });

    it('should return user on successful login with correct credentials', async () => {
      const user = await loginUser({ email: userData.email, password: userData.password });

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
    });

    it('should throw an error for a non-existent email', async () => {
      await expect(loginUser({ email: 'wrong@example.com', password: 'password123' })).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw an error for an incorrect password', async () => {
      await expect(loginUser({ email: userData.email, password: 'wrongpassword' })).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });
});