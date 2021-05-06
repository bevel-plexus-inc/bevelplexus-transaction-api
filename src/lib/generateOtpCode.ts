import otpGenerator from "otp-generator";

export default function generateOtpCode(): string {
    const otpLength = 6;

    return otpGenerator.generate(otpLength, { digits: true });
}
