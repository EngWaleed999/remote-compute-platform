export const emailTamplate = (otp: string) => {
    return `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">Welcome to NovaCPU</h2>
          <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #007bff; background: #f0f4f8; padding: 10px 20px; border-radius: 4px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 13px; color: #666;">This code is valid for 15 minutes. Please do not share this code with anyone.</p>
        </div>
      `
}