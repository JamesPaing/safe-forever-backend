import jwt from 'jsonwebtoken';

class JWT {
    sign(payload: object, options?: jwt.SignOptions | undefined) {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
            ...(options && options),
            // algorithm: 'RS256',
        });
    }

    verify(token: string) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);

            return {
                valid: true,
                expired: false,
                decoded,
            };
        } catch (error) {
            return {
                valid: false,
                expired: error.message === 'jwt expired',
                decoded: null,
            };
        }
    }
}

export default new JWT();
