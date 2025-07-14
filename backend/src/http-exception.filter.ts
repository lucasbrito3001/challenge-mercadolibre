import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: Logger) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let clientMessage = 'Something went wrong, please try again later';
        let errorName = 'InternalServerError';

        let fullMessage = '';
        let stackTrace = '';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const responseObj = exception.getResponse();

            if (typeof responseObj === 'string') {
                fullMessage = responseObj;
            } else if (
                typeof responseObj === 'object' &&
                responseObj !== null
            ) {
                const res = responseObj as any;
                fullMessage = res.message || fullMessage;
                errorName = res.error || errorName;
            }

            if (status < 500) {
                clientMessage = fullMessage;
            }
        } else if (exception instanceof Error) {
            fullMessage = exception.message;
            errorName = exception.name;
            stackTrace = exception.stack || '';
        }

        this.logger.error(
            `[${request.method}] ${request.url} - ${status} - ${fullMessage}`,
            stackTrace,
        );

        response.status(status).json({
            statusCode: status,
            message: clientMessage,
            error: errorName,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
