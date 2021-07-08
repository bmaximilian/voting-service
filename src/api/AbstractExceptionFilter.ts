import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost } from '@nestjs/common';

export type ExceptionMap<Out = Error, In = Error> = Record<string, (error: In) => Out>;

export abstract class AbstractExceptionFilter extends BaseExceptionFilter {
    /**
     * Catches and processes the exception
     *
     * @param exception - Thrown error
     * @param host - Argument host
     */
    public catch(exception: Error, host: ArgumentsHost): void {
        super.catch(this.transformException(exception), host);
    }

    protected abstract get exceptionMap(): ExceptionMap;

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
