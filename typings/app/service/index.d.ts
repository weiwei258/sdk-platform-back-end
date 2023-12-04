// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportApplication from '../../../app/service/Application';
import ExportLogs from '../../../app/service/Logs';
import ExportNews from '../../../app/service/News';
import ExportUser from '../../../app/service/User';

declare module 'egg' {
  interface IService {
    application: AutoInstanceType<typeof ExportApplication>;
    logs: AutoInstanceType<typeof ExportLogs>;
    news: AutoInstanceType<typeof ExportNews>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
