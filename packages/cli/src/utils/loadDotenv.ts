import fs from 'fs';
import chalk from 'chalk';
import { decrypt } from '@senv/core';

import {
  DOTENV_FILE_PREFIX,
  ENCRYPTED_FILE_EXTENSION,
  MASTER_KEY_NAME,
} from '../config';
import { withPrefix } from './withPrefix';
import { withExtension } from './withExtension';
import { logger } from './logger';

/**
 * Loads environment variables from selected environment
 *
 * @param environment Environment (examples: `default`, `production`, `stage`)
 */
export const loadDotenv = (environment: string = '') => {
  // .env.{environment}
  const fileName = withPrefix(DOTENV_FILE_PREFIX)(environment);
  // .env.{environment}.enc
  const encryptedFileName = withExtension(ENCRYPTED_FILE_EXTENSION)(fileName);
  // {environment}.master.key
  const masterKeyFileName = withPrefix(environment)(MASTER_KEY_NAME);

  const isEncryptedFileExists = fs.existsSync(encryptedFileName);

  if (!isEncryptedFileExists) {
    logger.error(`File ${chalk.dim(encryptedFileName)} not found.`);

    throw new Error('File was not found');
  }

  const data = fs.readFileSync(encryptedFileName).toString();
  const masterKey = fs.readFileSync(masterKeyFileName).toString();

  return decrypt(data, masterKey);
};
