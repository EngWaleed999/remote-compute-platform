const OTP_PREFIX = 'auth:otp:'
const OTP_VERIFICATION_PREFIX = 'verification:' as const;
const OTP_ATTEMPTS_PREFIX = 'attempts:' as const;
const OTP_COOLDOWN_PREFIX = 'cooldown:' as const;
const OTP_RESEND_COUNT_PREFIX = 'resend_count:' as const;

function verification(userId: string): string {
    return `${OTP_PREFIX}${OTP_VERIFICATION_PREFIX}${userId}`;
}


function attempts(userId: string): string {
    return `${OTP_PREFIX}${OTP_ATTEMPTS_PREFIX}${userId}`;
}


function cooldown(userId: string): string {
    return `${OTP_PREFIX}${OTP_COOLDOWN_PREFIX}${userId}`;
}

function resendCount(userId: string): string {
    return `${OTP_PREFIX}${OTP_RESEND_COUNT_PREFIX}${userId}`;
}

// ───────────────────────────────────────────────
// Public API
// ───────────────────────────────────────────────

export const otpKeys = {
    verification,
    attempts,
    cooldown,
    resendCount,
    /** Raw prefixes — exposed for Lua scripts and tests */
    prefixes: {
        verification: OTP_VERIFICATION_PREFIX,
        attempts: OTP_ATTEMPTS_PREFIX,
        cooldown: OTP_COOLDOWN_PREFIX,
        resendCount: OTP_RESEND_COUNT_PREFIX,
    },
} as const;
