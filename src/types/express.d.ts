namespace Express {
    interface User {
        user_id: string;
        session_id: string;
        first_name: string;
        last_name: string | null;
        user_name: string;
        contact: string | null;
        password: string;
        status: number;
        email: string;
        created_at: Date;
        updated_at: Date;
        created_by: string | null;
        updated_by: string | null;
    }

    interface ResponseBody {
        message?: string;
        status?: HttpStatus;
    }

    interface SuccessResponeBody<T = any> extends ResponseBody {
        data: T;
    }

    interface FailResponseBody<T = any> extends ResponseBody {
        errors: T;
    }

    interface Request {
        user?: User;
    }

    interface Response {
        user?: User;
    }

    interface Response {
        message: (data: ResponseBody) => this;
        success: <T = any>(data: SuccessResponeBody<T>) => this;
        fail: <T = any>(data: FailResponseBody<T>) => this;
        serverError: (data: ResponseBody) => this;
        notFound: (data: ResponseBody) => this;
        unauthorized: (data: ResponseBody) => this;
    }
}
