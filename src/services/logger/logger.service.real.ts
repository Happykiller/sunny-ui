// src\services\logger\logger.service.real.ts
import LoggerService from './logger.service';

export class LoggerServiceReal implements LoggerService {
  log(...args: any[]): void {
    console.log(args);
  }

  debug(...args: any[]): void {
    if (process.env.DEBUG === 'true') {
      console.debug(args);
    }
  }

  error(...args: any[]): void {
    if (process.env.DEBUG === 'true') {
      console.error(args);
    }
  }
} 