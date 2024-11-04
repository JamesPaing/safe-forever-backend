import httpStatus from 'http-status';

class BaseController {
    respondSuccessWithPaginator(
        res: any,
        data = [],
        paginator = {},
        message = '',
        { statusCode = httpStatus.OK } = {}
    ) {
        const response = {} as any;
        response.success = true;
        response.data = data;
        response.message = message;
        response.paginator = paginator;

        return res.status(statusCode).json(response);
    }

    respondSuccess(
        res: any,
        data: any,
        message = '',
        { statusCode = httpStatus.OK } = {}
    ) {
        return res.status(statusCode).json({
            success: true,
            data,
            message,
        });
    }

    respondCreated(res: any, data: any = [], message = '') {
        return res.status(httpStatus.CREATED).json({
            success: true,
            data,
            message,
        });
    }

    responseError(
        res: any,
        error = '',
        message = 'Error',
        { statusCode = httpStatus.BAD_REQUEST } = {}
    ) {
        return res.status(statusCode).json({
            success: false,
            error,
            message,
        });
    }

    responseNotFound(
        res: any,
        error = '',
        message = 'Not Found',
        { statusCode = httpStatus.NOT_FOUND } = {}
    ) {
        return res.status(statusCode).json({
            success: false,
            error,
            message,
        });
    }

    responseNoContent(res: any, message = 'No Content') {
        return res.status(200).json({
            success: false,
            data: null,
            message,
        });
    }
}

export default BaseController;
