namespace Auth {
    interface LoginInput {
        email: string;
        password: string;
    }

    interface GoogleOAuthTokenReponse {
        id_token: string;
        access_token: string;
    }
}
