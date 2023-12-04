import { PartialDefaultConfig } from './config.default';

export default () => {
  const config: PartialDefaultConfig = {};
  config.news = {
    pageSize: 30,
  };
  return config;
};
