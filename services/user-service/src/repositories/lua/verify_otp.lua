-- verify_otp.lua
-- ─────────────────────────────────────────────────────────────────
-- Atomic OTP Verification Script
-- ─────────────────────────────────────────────────────────────────
-- KEYS[1] = Verification Key (holds the hashed OTP)
-- KEYS[2] = Attempts Key (failed attempts counter)
-- KEYS[3] = Cooldown Key
--
-- ARGV[1] = Entered Hash
-- ARGV[2] = Max Attempts Allowed (e.g., 5)
-- ARGV[3] = OTP TTL in seconds (to set expiration on the attempts key)
-- ─────────────────────────────────────────────────────────────────

local currentAttempts = tonumber(redis.call('GET', KEYS[2]) or '0')
local maxAttempts = tonumber(ARGV[2])
local otpTtl = tonumber(ARGV[3])

-- 1. Check if already locked out
if currentAttempts >= maxAttempts then
    redis.call('DEL', KEYS[1]) -- Force new request
    return { -1, currentAttempts } -- Code -1: MAX_ATTEMPTS_EXCEEDED
end

-- 2. Check if OTP exists
local storedHash = redis.call('GET', KEYS[1])
if not storedHash then
    return { -2, currentAttempts } -- Code -2: OTP_EXPIRED
end

-- 3. Compare Hashes
if storedHash == ARGV[1] then
    -- MATCH! Cleanup all keys
    redis.call('DEL', KEYS[1], KEYS[2], KEYS[3])
    return { 1, 0 } -- Code 1: SUCCESS
else
    -- WRONG OTP! Increment failed attempts
    local newCount = redis.call('INCR', KEYS[2])
    
    if newCount == 1 then
        redis.call('EXPIRE', KEYS[2], otpTtl)
    end

    if newCount >= maxAttempts then
        redis.call('DEL', KEYS[1]) -- Delete OTP
        return { -3, newCount } -- Code -3: HIT_MAX_ATTEMPTS_NOW
    end
    
    return { 0, newCount } -- Code 0: WRONG_OTP (but attempts remaining)
end
