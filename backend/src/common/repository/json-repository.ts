import { InternalServerErrorException } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as path from 'path';
import { AppLogger } from 'src/common/logger/logger.interface';
import { Database } from 'src/db/type';

export class JsonRepository {
    constructor(protected readonly logger: AppLogger) {}

    public async getDatasource(): Promise<Database> {
        let datasource: Database;

        try {
            this.logger.log(`Reading the datasource file`, JsonRepository.name);
            const rawData = await readFile(
                path.join(__dirname, '..', '..', 'db', 'datasource.json'),
                'utf-8',
            );
            datasource = JSON.parse(rawData);
        } catch (error) {
            this.logger.error(
                'Failed to read or parse the datasource file',
                error.stack,
                JsonRepository.name,
            );
            throw new InternalServerErrorException(
                'Failed to access the datasource',
            );
        }

        return datasource;
    }
}
