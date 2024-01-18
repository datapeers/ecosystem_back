import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';
/**
 * @ignore
 */
@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger {}
