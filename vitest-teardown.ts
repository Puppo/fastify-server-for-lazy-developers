import PgDockerController from "./test/PgDockerController.js";

export async function setup() {
  await teardown();
}

export async function teardown() {
  await Promise.all([PgDockerController.cleanUp()]);
}
