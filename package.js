Package.describe({
  name: 'kostanos:seq',
  version: '0.0.1',
  summary: 'Simple Events Queue with Mongo',
  git: 'https://github.com/Kostanos/meteor-seq.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  // api.use([/*'raix:eventemitter'*/'kestanous:herald', 'kestanous:herald-web-notifications']);
  api.addFiles(['lib/seq.js'], ['client', 'server']);
  // api.addFiles(['templates/helpers.js'], 'client');
  // api.addFiles(['server/notifications/order_status.js',
  //               'server/observers/users.js'], 'server');
  // api.export('Events');
  api.export('SEQ');
});

Package.onTest(function(api) {
  // TODO: tests
});
