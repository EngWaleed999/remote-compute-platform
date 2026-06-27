// import { describe, it, expect, beforeAll, afterAll } from 'vitest';
// import request from 'supertest';
// import { app } from '../../src/app'; // Make sure to export your Express app
// import { redis } from '../../src/config/redis';
// import { prisma } from '../../src/config/prisma';  // or wherever your prisma client is

// describe('OTP Verification Flow (Integration Tests)', () => {
//   let testUserId: string;

//   // 1. SETUP: Runs once before all tests in this suite
//   beforeAll(async () => {
//     // Clear Redis cache to start fresh
//     await redis.flushall();

//     // You would typically create a mock user in the database here
//     // const user = await prisma.user.create({ data: { email: 'test@test.com', ... } });
//     // testUserId = user.id;
//   });

//   // 2. TEARDOWN: Runs once after all tests finish
//   afterAll(async () => {
//     await redis.flushall();
//     // await prisma.user.deleteMany({}); // Clean up database
//   });

//   // 3. ACTUAL TESTS
//   describe('POST /auth/resend-otp', () => {
//     it('should return 404 if user does not exist', async () => {
//       // Act: send a request using supertest
//       const res = await request(app)
//         .post('/auth/resend-otp')
//         .send({ userId: '00000000-0000-0000-0000-000000000000' }); // Non-existent UUID

//       // Assert: Verify the response
//       expect(res.status).toBe(404);
//       // expect(res.body.error).toBeDefined();
//     });

//     it('should successfully send OTP for a valid unverified user', async () => {
//       // NOTE: Uncomment and use the testUserId created in beforeAll
//       // const res = await request(app).post('/auth/resend-otp').send({ userId: testUserId });
//       // expect(res.status).toBe(200);
//       // expect(res.body.message).toContain('Verification code sent');
//       // expect(res.body.cooldown).toBe(60);
//     });

//     it('should enforce cooldown if requested too quickly', async () => {
//       // Example of testing rate-limiting/cooldowns
//       // await request(app).post('/auth/resend-otp').send({ userId: testUserId }); // 1st request
//       // const res = await request(app).post('/auth/resend-otp').send({ userId: testUserId }); // 2nd request immediately after
//       // expect(res.status).toBe(429);
//       // expect(res.body.error.code).toBe('OTP_COOLDOWN_ACTIVE');
//     });
//   });
// });
