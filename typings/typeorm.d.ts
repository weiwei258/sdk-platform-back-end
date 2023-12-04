// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import { Repository, Connection, TreeRepository } from 'typeorm';
import AppEntitiesApplication from '../app/entities/Application';
import AppEntitiesBase from '../app/entities/Base';
import AppEntitiesLogs from '../app/entities/Logs';
import AppEntitiesPermission from '../app/entities/Permission';
import AppEntitiesResource from '../app/entities/Resource';
import AppEntitiesUser from '../app/entities/User';
declare module 'egg' {
  interface Context {
    entity: {
      Application: typeof AppEntitiesApplication
      Base: typeof AppEntitiesBase
      Logs: typeof AppEntitiesLogs
      Permission: typeof AppEntitiesPermission
      Resource: typeof AppEntitiesResource
      User: typeof AppEntitiesUser
      default: {
        Application: typeof AppEntitiesApplication
        Base: typeof AppEntitiesBase
        Logs: typeof AppEntitiesLogs
        Permission: typeof AppEntitiesPermission
        Resource: typeof AppEntitiesResource
        User: typeof AppEntitiesUser
      }
    }
    repo: {
      Application: Repository<AppEntitiesApplication>
      Base: Repository<AppEntitiesBase>
      Logs: Repository<AppEntitiesLogs>
      Permission: Repository<AppEntitiesPermission>
      Resource: Repository<AppEntitiesResource>
      User: Repository<AppEntitiesUser>
      default: {
        Application: Repository<AppEntitiesApplication>
        Base: Repository<AppEntitiesBase>
        Logs: Repository<AppEntitiesLogs>
        Permission: Repository<AppEntitiesPermission>
        Resource: Repository<AppEntitiesResource>
        User: Repository<AppEntitiesUser>
      }
    }
  }
}