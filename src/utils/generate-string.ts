import crypto from 'crypto';

export function generateRandomString() {
    // generate a random 3-byte buffer
    const buffer = crypto.randomBytes(3);

    // convert the buffer to a hexadecimal string
    const hexString = buffer.toString('hex');

    // take the first 6 characters of the string
    return hexString.slice(0, 6);
}
