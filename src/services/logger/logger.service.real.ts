// src\services\logger\logger.service.real.ts
import LoggerService from './logger.service';

export class LoggerServiceReal implements LoggerService {

  constructor(readonly config?: any) {}

  log(...args: any[]): void {
    console.log(args);
  }

  debug(...args: any[]): void {
    if (this.config?.debug === 'true') {
      console.debug(args);
    }
  }

  error(...args: any[]): void {
    if (this.config?.debug === 'true') {
      console.error(args);
    }
  }
} 