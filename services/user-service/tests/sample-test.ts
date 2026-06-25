import { describe, it, expect } from 'vitest';

describe('Sample Test Suite', () => {
  it('should verify that math works', () => {
    expect(1 + 1).toBe(2);
  });

  it('should verify vitest is properly configured', () => {
    const isVitestAwesome = true;
    expect(isVitestAwesome).toBe(true);
  });
});
