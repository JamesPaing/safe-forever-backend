import ValidationError from '@helpers/validation-error';

export const validate =
    (schema: any, joiOptions = { abortEarly: false }) =>
    (req: any, _: any, next: any) => {
        console.log(req.body, 'body');
        const types = ['body', 'query', 'params'];

        let errorDetails: any[] = [];

        types.forEach((type: any) => {
            if (!schema[type]) return;

            const result = schema[type].validate(req[type], joiOptions);

            if (
                result.error &&
                result.error.details &&
                result.error.details.length > 0
            ) {
                errorDetails = errorDetails.concat(result.error.details || []);
            }

            req[type] = result.value;
        });

        if (errorDetails.length > 0) {
            errorDetails = errorDetails.map((detail) => {
                detail.message = detail.message.split(`"`).join(`'`);
                return detail;
            });

            throw new ValidationError(errorDetails);
        }

        next();
    };
