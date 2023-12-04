import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.redirect('/', '/news');
  router.get('/news', controller.news.list);
  router.get('/news/item/:id', controller.news.detail);
  router.get('/news/user/:id', controller.news.user);

  router.get('/user', controller.user.index);
  router.post('/user/register', controller.user.register);
  router.post('/user/login', controller.user.login);
  router.post('/user/checkToken', controller.user.checkToken);

  router.post('/app', controller.application.create);
  router.delete('/app', controller.application.delete);
  router.post('/app/validateConfig', controller.application.validateAppConfig);
  router.get('/app/list', controller.application.getAppList);
  router.get('/app', controller.application.getAppInfo);

  router.post('/upload/:path', controller.upload.index);

  router.post('/logs', controller.logs.index);
  router.get('/logs', controller.logs.getLogList);
};
