export declare class ResponseDto<T> {
    statusCode: number;
    message: string;
    data: T;
    constructor(statusCode: number, message: string, data: T);
}
