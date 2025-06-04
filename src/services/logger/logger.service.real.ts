// src\services\logger\logger.service.real.ts
import LoggerService from './logger.service';

export class LoggerServiceReal implements LoggerService {

  constructor(readonly config?: any) {}

  /**
   * For log
   * @param args 
   */
  log(...args: any[]): void {
    console.log(...args);
  }

  /**
   * For debug
   * @param args 
   */
  debug(...args: any[]): void {
    if (this.config?.debug === 'true') {
      console.debug(...args);
    }
  }

  /**
   * For error
   * @param args 
   */
  error(...args: any[]): void {
    if (this.config?.debug === 'true') {
      console.error(...args);
    }
  }
}
