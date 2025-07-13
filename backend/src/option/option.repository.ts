import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AppLogger } from 'src/common/logger/logger.interface';
import { JsonRepository } from '../common/repository/json-repository';
import { Database, ProductOption, ProductOptionValue } from 'src/db/type';

export interface GetAllByProductIdOutput extends ProductOption {
    optionValues: ProductOptionValue[];
}

@Injectable()
export class OptionRepository extends JsonRepository {
    constructor(
        @Inject('LoggerService')
        readonly logger: AppLogger,
    ) {
        super(logger);
    }

    async getAllByProductId(
        productId: number,
    ): Promise<GetAllByProductIdOutput[]> {
        let datasource: Database = await this.getDatasource();

        const options = datasource.product_option.filter(
            (option) => option.productId === productId,
        );

        if (options.length === 0) {
            this.logger.warn(
                `Options with productId "${productId}" not found`,
                OptionRepository.name,
            );

            throw new NotFoundException('Options not found');
        }

        const output = options.map((option) => {
            const optionValues = datasource.product_option_value
                .filter((optionValue) => optionValue.optionId === option.id)
                .map((optionValue): ProductOptionValue => {
                    return {
                        imageUrl: optionValue.imageUrl || null,
                        value: optionValue.value,
                        id: optionValue.id,
                        optionId: optionValue.optionId,
                    };
                });

            if (optionValues.length === 0) {
                this.logger.warn(
                    `Option values with optionId "${option.id}" not found`,
                    OptionRepository.name,
                );

                throw new NotFoundException('Option values not found');
            }

            return { ...option, optionValues };
        });

        this.logger.log(
            `Options found with productId: ${options.map((option) => option.value).join(', ')}`,
            OptionRepository.name,
        );

        return output;
    }
}
