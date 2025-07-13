jest.mock('@nestjs/common', () => {
    const originalModule = jest.requireActual('@nestjs/common');
    return {
        ...originalModule,

        Logger: jest.fn().mockImplementation(() => ({
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
        })),
    };
});

import { NestLoggerService } from './nest-logger.service';
import { Logger } from '@nestjs/common';

describe('NestLoggerService', () => {
    let service: NestLoggerService;
    let mockedLoggerInstance: any;

    beforeEach(() => {
        const MockedLoggerClass = Logger as any as jest.Mock;
        MockedLoggerClass.mockClear();

        service = new NestLoggerService();

        mockedLoggerInstance = MockedLoggerClass.mock.results[0]?.value;

        if (!mockedLoggerInstance) {
            throw new Error(
                'Mocked Logger instance was not created. Ensure NestLoggerService calls `new Logger()`.',
            );
        }

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('log', () => {
        it('should call NestJS Logger.log with message and context', () => {
            const message = 'Test log message';
            const context = 'TestContext';

            service.log(message, context);

            expect(mockedLoggerInstance.log).toHaveBeenCalledTimes(1);
            expect(mockedLoggerInstance.log).toHaveBeenCalledWith(
                message,
                context,
            );
        });

        it('should call NestJS Logger.log with message only when context is not provided', () => {
            const message = 'Another log message';

            service.log(message);

            expect(mockedLoggerInstance.log).toHaveBeenCalledTimes(1);
            expect(mockedLoggerInstance.log).toHaveBeenCalledWith(
                message,
                undefined,
            );
        });
    });

    describe('warn', () => {
        it('should call NestJS Logger.warn with message and context', () => {
            const message = 'Test warn message';
            const context = 'WarnContext';

            service.warn(message, context);

            expect(mockedLoggerInstance.warn).toHaveBeenCalledTimes(1);
            expect(mockedLoggerInstance.warn).toHaveBeenCalledWith(
                message,
                context,
            );
        });

        it('should call NestJS Logger.warn with message only when context is not provided', () => {
            const message = 'Another warn message';

            service.warn(message);

            expect(mockedLoggerInstance.warn).toHaveBeenCalledTimes(1);
            expect(mockedLoggerInstance.warn).toHaveBeenCalledWith(
                message,
                undefined,
            );
        });
    });

    describe('error', () => {
        it('should call NestJS Logger.error with message, trace, and context', () => {
            const message = 'Test error message';
            const trace = 'Error stack trace';
            const context = 'ErrorContext';

            service.error(message, trace, context);

            expect(mockedLoggerInstance.error).toHaveBeenCalledTimes(1);
            expect(mockedLoggerInstance.error).toHaveBeenCalledWith(
                message,
                trace,
                context,
            );
        });

        it('should call NestJS Logger.error with message and trace when context is not provided', () => {
            const message = 'Another error message';
            const trace = 'Another stack trace';

            service.error(message, trace);

            expect(mockedLoggerInstance.error).toHaveBeenCalledTimes(1);
            expect(mockedLoggerInstance.error).toHaveBeenCalledWith(
                message,
                trace,
                undefined,
            );
        });

        it('should call NestJS Logger.error with message only when trace and context are not provided', () => {
            const message = 'Simple error message';

            service.error(message);

            expect(mockedLoggerInstance.error).toHaveBeenCalledTimes(1);
            expect(mockedLoggerInstance.error).toHaveBeenCalledWith(
                message,
                undefined,
                undefined,
            );
        });
    });

    describe('debug', () => {
        it('should call NestJS Logger.debug with message and context if debug method exists', () => {
            const message = 'Test debug message';
            const context = 'DebugContext';

            service.debug(message, context);

            expect(mockedLoggerInstance.debug).toHaveBeenCalledTimes(1);
            expect(mockedLoggerInstance.debug).toHaveBeenCalledWith(
                message,
                context,
            );
        });

        it('should call NestJS Logger.debug with message only when context is not provided', () => {
            const message = 'Another debug message';

            service.debug(message);

            expect(mockedLoggerInstance.debug).toHaveBeenCalledTimes(1);
            expect(mockedLoggerInstance.debug).toHaveBeenCalledWith(
                message,
                undefined,
            );
        });

        it('should not throw error if NestJS Logger.debug is undefined (older NestJS versions)', () => {
            const MockedLoggerClass = Logger as any as jest.Mock;
            MockedLoggerClass.mockImplementationOnce(() => ({
                log: jest.fn(),
                warn: jest.fn(),
                error: jest.fn(),
                debug: undefined,
            }));

            const newService = new NestLoggerService();

            expect(() =>
                newService.debug('This should not throw'),
            ).not.toThrow();

            expect(mockedLoggerInstance.debug).not.toHaveBeenCalled();
            expect((newService as any)['logger'].debug).toBeUndefined();
        });
    });
});
