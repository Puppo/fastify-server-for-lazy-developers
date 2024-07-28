import { kebabCase } from "case-anything";
import { exec } from "child_process";
import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";
import { setInterval } from "timers/promises";
import {
  buildDbConfig,
  DatabaseConnectionsConfig,
} from "../src/commons/config/dbConfig.js";
import { createDbConnection } from "../src/commons/infrastructure/plugins/database-connections.js";

import Docker, { Container, ContainerInfo } from "dockerode";
import { config } from "dotenv";
import { prop } from "rambda";

const { parsed: parsedEnv = {} } = config();

const CONTAINER_PREFIX = "pgDockerController";
const PG_IMAGE = `postgres:${process.env.POSTGRES_VERSION}-alpine`;

const env = Object.entries(parsedEnv).map(([key, value]) => `${key}=${value}`);

export default class PgDockerController {
  private static readonly dockerConnection: Docker = new Docker();
  private runningContainer?: Container;
  private readonly dbConfig: DatabaseConnectionsConfig = buildDbConfig();
  private readonly postgratorOpts = Object.entries({
    ...{ driver: "pg" },
    ...this.dbConfig.default,
  }).reduce(
    (acc, [key, value]) => (acc += ` --${kebabCase(key)} ${value}`),
    "--no-config",
  );
  public readonly db: Kysely<DB> = createDbConnection(this.dbConfig);
  private tables: string[] = [];

  async setup() {
    this.runningContainer =
      await PgDockerController.dockerConnection.createContainer({
        Image: PG_IMAGE,
        HostConfig: {
          PortBindings: {
            "5432": [{ HostPort: `${this.dbConfig.default.port}` }],
          },
        },
        ExposedPorts: {
          "5432": {},
        },
        Env: env,
        name: `${CONTAINER_PREFIX}-${Date.now()}-${this.dbConfig.default.port}`,
      });

    await this.runningContainer.start();

    await this.waitPgBoot();

    await this.applyMigrations();

    this.tables = (await this.db.introspection.getTables())
      .map(prop("name"))
      .filter((name) => name !== "schemaversion");
  }

  private async waitPgBoot() {
    for await (const useStdErr of setInterval(100, 0)) {
      const logs = await this.runningContainer?.logs({
        stdout: true,
        stderr: Boolean(useStdErr),
      });
      const isReady = logs
        ?.toString()
        .includes("database system is ready to accept connections");
      if (isReady) {
        break;
      }
    }
  }

  private async applyMigrations() {
    await this.executeCommand(`${this.postgratorOpts}`);
  }

  async undoMigrations() {
    await this.executeCommand(`0 ${this.postgratorOpts}`);
  }

  private executeCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(
        `npx postgrator ${command}`,
        {
          env: {
            ...parsedEnv,
            PATH: process.env.PATH,
            POSTGRES_PORT: `${this.dbConfig.default.port}`,
          },
        },
        (error, stout, stderr) => {
          if (error) {
            console.log(stout);
            console.error(stderr);
            reject(error);
          } else {
            resolve();
          }
        },
      );
    });
  }

  async tearDown() {
    await PgDockerController.deleteContainer(this.runningContainer!);
  }

  async reset() {
    await Promise.all(
      this.tables.map((table) =>
        sql
          .raw(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`)
          .execute(this.db),
      ),
    );
  }

  static async cleanUp() {
    const containersList =
      await PgDockerController.dockerConnection.listContainers({
        all: true,
      });
    const deletePromises = containersList
      .filter(PgDockerController.isControlledContainer)
      .map((container) => container.Id)
      .map(
        PgDockerController.dockerConnection.getContainer,
        PgDockerController.dockerConnection,
      )
      .map(PgDockerController.deleteContainer);

    await Promise.all(deletePromises);
  }

  private static isControlledContainer(container: ContainerInfo): boolean {
    return Boolean(
      container.Names.find((name) => name.includes(CONTAINER_PREFIX)),
    );
  }

  private static async deleteContainer(container: Container) {
    await container.stop().catch(() => ({}));
    await container.remove({ v: true }).catch(() => ({}));
  }
}
