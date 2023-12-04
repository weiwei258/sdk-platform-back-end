// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportApplication from '../../../app/controller/application';
import ExportLogs from '../../../app/controller/logs';
import ExportNews from '../../../app/controller/news';
import ExportUpload from '../../../app/controller/upload';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    application: ExportApplication;
    logs: ExportLogs;
    news: ExportNews;
    upload: ExportUpload;
    user: ExportUser;
  }
}
