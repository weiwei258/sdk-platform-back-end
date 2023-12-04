import { PartialDefaultConfig } from './config.default';

export default () => {
  const config: PartialDefaultConfig = {};

  config.news = {
    pageSize: 20,
  };
  return config;
};
