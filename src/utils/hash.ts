import bcrypt from 'bcrypt';

class Hash {
    make(data: string): string {
        const salt = bcrypt.genSaltSync(
            parseInt(process.env.SALT_WORK_FACTOR!) || 10
        );

        return bcrypt.hashSync(data, salt);
    }

    check(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}

export default new Hash();
