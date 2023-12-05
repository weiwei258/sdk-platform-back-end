import { EggAppConfig, PowerPartial } from 'egg';
import * as fs from 'fs';
import * as path from 'path';
import { DataSourceOptions } from 'typeorm';


// app special config scheme
export interface BizConfig {
  sourceUrl: string;
  news: {
    pageSize: number;
    serverUrl: string;
  };
}

export type UploadFileAbsolutePath = string;

// for config.{env}.ts
export interface Jwt {
  secretKey: string,
  expiresIn: string,
}

export const secretKey = 'weiwei8848';

export type DefaultConfig = PowerPartial<EggAppConfig> & BizConfig & {
  typeorm?: {
    client: DataSourceOptions
  }
  jwt: Jwt
  uploadFileAbsolutePath: UploadFileAbsolutePath
  mapFileAbsolutePath: string
};

export type PartialDefaultConfig = PowerPartial<DefaultConfig>;


export default (appInfo: EggAppConfig) => {
  const config = {} as DefaultConfig;

  config.middleware = ['responseHandler'];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, 'app/public/favicon.png')),
  };

  config.jwt = {
    secretKey,
    expiresIn: '12h',
  };

  // 文件上传配置
  config.multipart = {
    mode: 'file',
    fileSize: '50mb', // 设置文件大小限制，默认为10mb
    whitelist: ['.jpg', '.jpeg', '.png', '.gif', '.js'], // 设置允许上传的文件类型
  };

  const filePath = '../../static/uploads';
  const absolutePath = path.resolve(__dirname, filePath);
  config.uploadFileAbsolutePath = absolutePath;
  const mapFilePath = '/mapFile'
  config.mapFileAbsolutePath = absolutePath + mapFilePath

  const staticAbsolutePath = path.resolve(__dirname, '../../static');

  // 静态文件托管配置
  config.static = {
    prefix: '/static/', // 设置静态文件访问的URL前缀
    dir: staticAbsolutePath, // 设置静态文件存储的位置
  };

  config.typeorm = {
    client: {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'egg',
      synchronize: true,
      logging: false,
    },
  };

  // config.redis = {
  //   client: {
  //     host: '101.42.138.18', // Redis 服务器地址
  //     port: 6379, // Redis 服务器端口号
  //     password: '123456', // Redis 服务器密码（如果有的话）
  //     db: 0,
  //   },
  // };

  config.security = {
    csrf: {
      enable: false, // 禁用 CSRF
    },
  };

  config.cors = {
    origin: '*', // 允许所有请求跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  return config;
};
