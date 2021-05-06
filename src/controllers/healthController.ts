import sentryHttpLogger from "@lib/sentryHttpLogger";
import sequelize from "@models/index";
import { autobind } from "core-decorators";
import { Request, Response } from "express";

export default class HealthController {
    @autobind
    async healthCheck(req: Request, res: Response): Promise<Response> {
        try {
            await sequelize.authenticate();
            const healthCheckProps = {
                uptime:    process.uptime(),
                status:    "up",
                timestamp: Date.now(),
            };

            return res.status(200).json(healthCheckProps);
        } catch (e) {
            sentryHttpLogger(e, req);
            const healthCheckProps = {
                uptime:    process.uptime(),
                status:    "down",
                timestamp: Date.now(),
            };

            return res.status(500).json(healthCheckProps);
        }
    }
}
