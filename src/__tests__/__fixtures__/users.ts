import { User } from '@prisma/client';

export const user: User = {
    user_id: 'b79bddc5-969d-4f96-9dd8-c41d7cb0e814',
    user_name: 'demo_user',
    first_name: 'demo',
    last_name: 'user',
    email: 'demo@mail.com',
    contact: '7777777',
    password: '1234',
    status: 1,
    created_at: new Date(),
    updated_at: new Date(),
    created_by: null,
    updated_by: null,
};
