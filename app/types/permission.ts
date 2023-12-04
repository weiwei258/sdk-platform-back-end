import Application from '../entities/Application';


export type Name = 'admin' | 'common';

export type UserPermissions = {
  app: Record<Application['appId'], {
    [key in Name]?: boolean
  }>,
  platform: {
    [key in Name]?: boolean
  }
};
