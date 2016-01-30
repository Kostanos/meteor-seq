Package.describe({
  name: 'kostanos:seq',
  version: '0.0.1',
  summary: 'Simple Events Queue with Mongo',
  git: 'https://github.com/Kostanos/meteor-seq.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.addFiles(['lib/seq.js'], ['client', 'server']);
  api.export('SEQ');
});

Package.onTest(function(api) {
  // TODO: tests
});
