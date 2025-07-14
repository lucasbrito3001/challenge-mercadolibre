import { InternalServerErrorException } from '@nestjs/common';
import { JsonRepository } from './json-repository';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AppLogger } from 'src/common/logger/logger.interface';
import { Database } from 'src/db/type';
import { mockDatabaseEmpty } from 'src/mock';

jest.mock('fs/promises', () => ({
    readFile: jest.fn(),
}));

jest.mock('path', () => ({
    join: jest.fn(),
}));

const mockDatabase: Database = mockDatabaseEmpty;

describe('JsonRepository', () => {
    let repository: JsonRepository;
    let mockLogger: AppLogger;
    let readFileMock: jest.Mock;

    const dbPath = '/var/lib/backend_meli/datasource.json';

    beforeEach(() => {
        mockLogger = {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        };

        repository = new JsonRepository(mockLogger);

        readFileMock = fs.readFile as jest.Mock;

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    it(`should call readFile with ${dbPath}`, async () => {
        readFileMock.mockResolvedValueOnce(JSON.stringify(mockDatabase));

        await repository.getDatasource();

        expect(readFileMock).toHaveBeenCalledWith(dbPath, 'utf-8');
    });

    it('should successfully read and parse the datasource file', async () => {
        readFileMock.mockResolvedValueOnce(JSON.stringify(mockDatabase));

        const result = await repository.getDatasource();

        expect(mockLogger.log).toHaveBeenCalledWith(
            'Reading the datasource file',
            JsonRepository.name,
        );

        expect(result).toEqual(mockDatabase);
    });

    it('should throw InternalServerErrorException if the datasource file cannot be read', async () => {
        const errorMessage = 'Permission denied';

        readFileMock.mockRejectedValueOnce(new Error(errorMessage));

        const rejection = await expect(repository.getDatasource()).rejects;

        rejection.toThrow(InternalServerErrorException);
        rejection.toHaveProperty('message', 'Failed to access the datasource');

        expect(mockLogger.error).toHaveBeenCalledWith(
            'Failed to read or parse the datasource file',
            expect.any(String),
            JsonRepository.name,
        );
    });

    it('should throw InternalServerErrorException if the datasource file is malformed JSON', async () => {
        const malformedJson = '{"key": "value", "anotherKey": }';

        readFileMock.mockResolvedValueOnce(malformedJson);

        const rejection = await expect(repository.getDatasource()).rejects;

        rejection.toThrow(InternalServerErrorException);
        rejection.toHaveProperty('message', 'Failed to access the datasource');

        expect(mockLogger.error).toHaveBeenCalledWith(
            'Failed to read or parse the datasource file',
            expect.any(String),
            JsonRepository.name,
        );
    });
});
