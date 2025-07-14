import { Test, TestingModule } from '@nestjs/testing';
import { PinoLoggerService } from './pino-logger.service';
import { PinoLogger } from 'nestjs-pino';

describe('PinoLoggerService', () => {
    let service: PinoLoggerService;
    let pinoLogger: PinoLogger;

    const mockPinoLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PinoLoggerService,
                {
                    provide: PinoLogger,
                    useValue: mockPinoLogger,
                },
            ],
        }).compile();

        service = module.get<PinoLoggerService>(PinoLoggerService);
        pinoLogger = module.get<PinoLogger>(PinoLogger);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('log', () => {
        it('should call pinoLogger.info with message and context', () => {
            const message = 'Test log message';
            const context = 'TestContext';
            service.log(message, context);
            expect(pinoLogger.info).toHaveBeenCalledWith(message, context);
        });

        it('should call pinoLogger.info with message only if context is not provided', () => {
            const message = 'Test log message without context';
            service.log(message);
            expect(pinoLogger.info).toHaveBeenCalledWith(message, undefined);
        });
    });

    describe('warn', () => {
        it('should call pinoLogger.warn with message and context', () => {
            const message = 'Test warn message';
            const context = 'WarnContext';
            service.warn(message, context);
            expect(pinoLogger.warn).toHaveBeenCalledWith(message, context);
        });

        it('should call pinoLogger.warn with message only if context is not provided', () => {
            const message = 'Test warn message without context';
            service.warn(message);
            expect(pinoLogger.warn).toHaveBeenCalledWith(message, undefined);
        });
    });

    describe('error', () => {
        it('should call pinoLogger.error with message, trace and context', () => {
            const message = 'Test error message';
            const trace = 'ErrorStack';
            const context = 'ErrorContext';
            service.error(message, trace, context);
            expect(pinoLogger.error).toHaveBeenCalledWith(
                message,
                trace,
                context,
            );
        });

        it('should call pinoLogger.error with message and trace if context is not provided', () => {
            const message = 'Test error message without context';
            const trace = 'ErrorStack';
            service.error(message, trace);
            expect(pinoLogger.error).toHaveBeenCalledWith(
                message,
                trace,
                undefined,
            );
        });

        it('should call pinoLogger.error with message only if trace and context are not provided', () => {
            const message = 'Test error message minimal';
            service.error(message);
            expect(pinoLogger.error).toHaveBeenCalledWith(
                message,
                undefined,
                undefined,
            );
        });
    });
});
