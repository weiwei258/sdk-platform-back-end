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
    fileSize: '10mb', // 设置文件大小限制，默认为10mb
    whitelist: ['.jpg', '.jpeg', '.png', '.gif', '.js'], // 设置允许上传的文件类型
  };

  // bodyParser 配置
  config.bodyParser = {
    enable: true,
    jsonLimit: '10mb', // 设置 JSON 请求的大小限制为 10MB
    formLimit: '10mb', // 设置表单请求的大小限制为 10MB
  }

  config.multipart = {
    mode: 'file',
    whitelist: ['.map', '.png', 'jpeg', 'jpg'],
    files: 50,
    fileSize:'100mb',
  }

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
      password: '12345678',
      database: 'egg',
      synchronize: true,
      logging: false,
    },
  };

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
