import Hashids from "hashids";

// Use a strong secret for salt
const hashids = new Hashids("my-unique-secret-salt", 8); // min length 8 for shorter code

// Encode ObjectId -> referral code
export function encodeUserId(userId: string) {
  // MongoDB ObjectId is 12 bytes (24 hex chars)
  const buffer = Buffer.from(userId, "hex");
  const numbers = Array.from(buffer.values()); // convert each byte to number array
  return hashids.encode(numbers);
}

// Decode referral code -> ObjectId
export function decodeReferralCode(code: string) {
  const numbers = hashids.decode(code);       // decode to number array
  if (!numbers.length) throw new Error("Invalid referral code")
  const buffer = Buffer.from(numbers);        // convert back to bytes
  return buffer.toString("hex");              // original ObjectId
}
