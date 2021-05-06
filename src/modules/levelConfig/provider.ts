import { Injectable } from "@graphql-modules/di";
import LevelConfig from "@models/levelConfig";
import { ErrorResponse } from "@shared/types";
import LevelConfigArgs from "./input";

@Injectable()
export default class LevelConfigProvider {
    async createLevelConfig(args: LevelConfigArgs): Promise<LevelConfig | null> {
        const existingConfig = await LevelConfig.findOne({ where: { level: args.level } });
        if (existingConfig) {
            return null;
        }

        return LevelConfig.create(args);
    }

    async getLevelConfig(configId: string): Promise<LevelConfig | null> {
        return LevelConfig.findByPk(configId);
    }

    async getLevelConfigByLevel(level: number): Promise<LevelConfig | null> {
        return LevelConfig.findOne({
            where: { level },
            raw:   true,
        });
    }

    async getAllLevelConfig(): Promise<Array<LevelConfig>> {
        return LevelConfig.findAll({ order: [["createdAt", "DESC"]] });
    }

    async updateLevelConfig(levelConfigId: string, args: LevelConfigArgs)
        : Promise<LevelConfig | ErrorResponse> {
        const levelConfig = await this.getLevelConfig(levelConfigId);
        if (!levelConfig) {
            return {
                error:      "Level config not found",
                identifier: levelConfigId,
                message:    `No Record found for level config id: ${levelConfigId}`,
            };
        }

        levelConfig.dailyLimit = args.dailyLimit;
        levelConfig.monthlyLimit = args.monthlyLimit;
        levelConfig.level = args.level;
        await levelConfig.save();

        return levelConfig;
    }

    async deleteLevelConfig(levelConfigId: string)
        : Promise<LevelConfig | ErrorResponse> {
        const levelConfig = await this.getLevelConfig(levelConfigId);
        if (!levelConfig) {
            return {
                error:      "Level config not found",
                identifier: levelConfigId,
                message:    `No Record found for level config id: ${levelConfigId}`,
            };
        }

        await levelConfig.destroy();

        return levelConfig;
    }
}
