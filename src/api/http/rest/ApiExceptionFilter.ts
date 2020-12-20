import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch, HttpException, UnauthorizedException } from '@nestjs/common';
import { TokenInvalidError } from '../../../infrastructure/security/jwt/TokenInvalidError';
import { TokenNotFoundError } from '../../../infrastructure/security/jwt/TokenNotFoundError';

@Catch()
export class ApiExceptionFilter extends BaseExceptionFilter {
    private exceptionMap: Record<string, (error: Error) => HttpException> = {
        [TokenInvalidError.name]: (e: Error) => new UnauthorizedException(e.message),
        [TokenNotFoundError.name]: (e: Error) => new UnauthorizedException(e.message),
    };

    /**
     * Catches and processes the exception
     *
     * @param exception - Thrown error
     * @param host - Argument host
     */
    public catch(exception: Error, host: ArgumentsHost): void {
        super.catch(this.transformException(exception), host);
    }

    /**
     * Transforms internal exceptions to related api exceptions
     *
     * @param exception - Thrown error
     * @returns The transformed error
     */
    private transformException(exception: Error): Error {
        const httpExceptionFactoryMethodKey = Object.keys(this.exceptionMap).find(
            (className) => exception.constructor.name === className,
        );

        if (!httpExceptionFactoryMethodKey) {
            return exception;
        }

        return this.exceptionMap[httpExceptionFactoryMethodKey](exception);
    }
}
