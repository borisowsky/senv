import execa from 'execa';

import { DEFAULT_ENVIRONMENT_NAME, Environment } from '../config';
import { logger, loadDotenv, parseDotenv } from '../utils';

export const load = (environment: Environment, postCommands: string[]) => {
  if (environment === DEFAULT_ENVIRONMENT_NAME) {
    environment = '';
  }

  try {
    const variablesMap = loadDotenv(environment);
    const variablesMapAsObject = parseDotenv(variablesMap);

    for (const key in variablesMapAsObject) {
      if (key in process.env) {
        logger.error(`process.env already has ${key} value, won't override.`);
      } else {
        process.env[key] = variablesMapAsObject[key];
      }
    }
  } catch {
    return;
  }

  if (postCommands.length > 0) {
    const [command, ...params] = postCommands;

    execa(command, params, { stdio: 'inherit' });
  } else {
    logger.warn(
      "You didn't specified any command after environment variables load.",
    );
  }
};
