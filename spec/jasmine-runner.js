const Jasmine = require('jasmine');
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

const jrunner = new Jasmine();
jrunner.env.clearReporters();  // remove default reporter logs
jrunner.addReporter(new SpecReporter({
  // add jasmine-spec-reporter
  spec: {displayPending: true}
}));
jrunner.loadConfigFile();  // load jasmine.json configuration
jrunner.execute();
