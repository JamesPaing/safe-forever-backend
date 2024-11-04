import J from 'joi';

export const validator = {
    findAll: {
        query: J.object({
            page: J.number().optional(),
            limit: J.number().optional(),
            status: J.number().optional(),
            user_name: J.string().optional(),
        }),
    },
    createOne: {
        body: J.object({
            first_name: J.string().required(),
            last_name: J.string().allow('', null).optional(),
            email: J.string().email().required(),
            contact: J.string().required(),
            user_name: J.string().required(),
            password: J.string().required(),
            status: J.number().optional(),
        }),
    },
    updateOne: {
        params: J.object({
            userId: J.number().required(),
        }),
        body: J.object({
            first_name: J.string().optional(),
            last_name: J.string().allow('', null).optional(),
            email: J.string().email().optional(),
            phone1: J.string().optional(),
            phone2: J.string().allow('', null).optional(),
            phone3: J.string().allow('', null).optional(),
            phone4: J.string().allow('', null).optional(),
            username: J.string().optional(),
            first_login: J.number().allow('', null).optional(),
            user_role_id: J.number().optional(),
            status: J.number().optional(),
            remark: J.string().allow('', null).max(5000),
            description: J.string().allow('', null).max(5000),
        }),
    },
    deleteOne: {
        params: J.object({
            userId: J.number().required(),
        }),
    },
    changePassword: {
        params: J.object({
            userId: J.number().required(),
        }),
        body: J.object({
            password: J.string().required(),
        }),
    },
};
