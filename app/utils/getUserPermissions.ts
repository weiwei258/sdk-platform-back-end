import Permission from '../entities/Permission';
import { UserPermissions } from '../types/permission';

export const getUserPermission = (permissionList: Permission[]) => {
  return permissionList.reduce<UserPermissions>((result, permission) => {
    if (permission.type === 'app') {
      result.app = {
        ...result.app,
        [permission.application.appId]: {
          ...(result.app?.[permission.application.appId] || {}),
          [permission.name]: true,
        },
      };
    }

    if (permission.type === 'platform') {
      result.platform = {
        ...result.platform,
        [permission.name]: true,
      };
    }

    return result;
  }, { app: {}, platform: {} } as UserPermissions);
};
