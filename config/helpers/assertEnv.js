/* eslint-disable no-console */

import chalk from 'chalk';

export default function assertEnv(env) {
  if (process.env.NODE_ENV !== env) {
    console.log(chalk.whiteBright.bgRed.bold(
      `"process.env.NODE_ENV" must be "${env}" to use this webpack config`
    ));
    process.exit(1);
  }
}
