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
    let pathJoinMock: jest.Mock;

    beforeEach(() => {
        mockLogger = {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        };

        repository = new JsonRepository(mockLogger);

        readFileMock = fs.readFile as jest.Mock;
        pathJoinMock = path.join as jest.Mock;

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    it('should successfully read and parse the datasource file', async () => {
        const expectedDbPath = '/mock/path/to/datasource.json';

        pathJoinMock.mockReturnValue(expectedDbPath);

        readFileMock.mockResolvedValueOnce(JSON.stringify(mockDatabase));

        const result = await repository.getDatasource();

        expect(pathJoinMock).toHaveBeenCalledWith(
            expect.any(String),
            '..',
            '..',
            'db',
            'datasource.json',
        );

        expect(readFileMock).toHaveBeenCalledWith(expectedDbPath, 'utf-8');

        expect(mockLogger.log).toHaveBeenCalledWith(
            'Reading the datasource file',
            JsonRepository.name,
        );

        expect(result).toEqual(mockDatabase);
    });

    it('should throw InternalServerErrorException if the datasource file cannot be read', async () => {
        const errorMessage = 'Permission denied';
        const expectedDbPath = '/mock/path/to/datasource.json';

        pathJoinMock.mockReturnValue(expectedDbPath);

        readFileMock.mockRejectedValueOnce(new Error(errorMessage));

        const rejection = await expect(repository.getDatasource()).rejects;

        rejection.toThrow(InternalServerErrorException);
        rejection.toHaveProperty('message', 'Failed to access the datasource');

        expect(mockLogger.error).toHaveBeenCalledWith(
            'Failed to read or parse the datasource file',
            expect.any(String),
            JsonRepository.name,
        );

        expect(pathJoinMock).toHaveBeenCalledWith(
            expect.any(String),
            '..',
            '..',
            'db',
            'datasource.json',
        );

        expect(readFileMock).toHaveBeenCalledWith(expectedDbPath, 'utf-8');
    });

    it('should throw InternalServerErrorException if the datasource file is malformed JSON', async () => {
        const malformedJson = '{"key": "value", "anotherKey": }';
        const expectedDbPath = '/mock/path/to/datasource.json';

        pathJoinMock.mockReturnValue(expectedDbPath);

        readFileMock.mockResolvedValueOnce(malformedJson);

        const rejection = await expect(repository.getDatasource()).rejects;

        rejection.toThrow(InternalServerErrorException);
        rejection.toHaveProperty('message', 'Failed to access the datasource');

        expect(mockLogger.error).toHaveBeenCalledWith(
            'Failed to read or parse the datasource file',
            expect.any(String),
            JsonRepository.name,
        );

        expect(pathJoinMock).toHaveBeenCalledWith(
            expect.any(String),
            '..',
            '..',
            'db',
            'datasource.json',
        );

        expect(readFileMock).toHaveBeenCalledWith(expectedDbPath, 'utf-8');
    });
});
