import { isInstanceOfError } from "@lib/instanceChecker";
import { ErrorResponse, GenericRole } from "@shared/types";
import {
    Arg, Authorized, Mutation, Query, Resolver,
} from "type-graphql";
import LevelConfigArgs from "./input";
import LevelConfigProvider from "./provider";
import LevelConfig from "./types";

@Resolver(of => LevelConfig)
export default class LevelConfigResolver {
    // eslint-disable-next-line no-empty-function
    constructor(private readonly levelConfigProvider: LevelConfigProvider) {}

    @Authorized(GenericRole.Admin)
    @Query(returns => LevelConfig, { nullable: true })
    async getLevelConfig(@Arg("levelConfigId") levelConfigId: string): Promise<LevelConfig | null> {
        return this.levelConfigProvider.getLevelConfig(levelConfigId);
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => [LevelConfig])
    async getAllLevelConfig(): Promise<Array<LevelConfig>> {
        return this.levelConfigProvider.getAllLevelConfig();
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => LevelConfig, { nullable: true })
    async createLevelConfig(@Arg("args") args: LevelConfigArgs): Promise<LevelConfig | null> {
        const allowedLevels = [0, 1, 2, 3];
        if (!allowedLevels.includes(args.level)) {
            throw new Error("Level selected is not allowed");
        }

        return this.levelConfigProvider.createLevelConfig(args);
    }

    @Authorized(GenericRole.Admin)
    @Mutation(returns => LevelConfig)
    async updateLevelConfig(
        @Arg("levelConfigId") levelConfigId: string,
        @Arg("args") args: LevelConfigArgs,
    ): Promise<LevelConfig> {
        const allowedLevels = [0, 1, 2, 3];
        if (!allowedLevels.includes(args.level)) {
            throw new Error("Level selected is not allowed");
        }

        const response = await this.levelConfigProvider.updateLevelConfig(levelConfigId, args);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as LevelConfig;
    }

    @Authorized(GenericRole.Admin)
    @Query(returns => LevelConfig)
    async deleteLevelConfig(@Arg("levelConfigId") levelConfigId: string): Promise<LevelConfig> {
        const response = await this.levelConfigProvider.deleteLevelConfig(levelConfigId);
        if (isInstanceOfError(response)) {
            throw new Error((response as ErrorResponse).error);
        }

        return response as LevelConfig;
    }
}
