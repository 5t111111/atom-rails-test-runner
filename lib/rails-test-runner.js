'use babel';

import RailsTestRunnerView from './rails-test-runner-view';
import { CompositeDisposable } from 'atom';
import url from 'url';

export default {

  railsTestRunnerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.railsTestRunnerView = new RailsTestRunnerView(state.railsTestRunnerViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.railsTestRunnerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that runs this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'rails-test-runner:run': () => this.run()
    }));

    atom.workspace.addOpener(function (uriToOpen) {
      parsed_url = url.parse(uriToOpen);
      console.log(parsed_url);
      if (parsed_url.protocol != 'test-runner-output:') {
        return;
      }
      return new RailsTestRunnerView(parsed_url.pathname);
    });
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.railsTestRunnerView.destroy();
  },

  serialize() {
    return {
      railsTestRunnerViewState: this.railsTestRunnerView.serialize()
    };
  },

  run() {
    console.log('run!');
    editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      return;
    }
    this.openUriFor(editor.getPath());
  },

  openUriFor(filePath) {
    previousActivePane = atom.workspace.getActivePane();
    uri = `test-runner-output://#{filePath}`
    atom.workspace.open(uri, { 'split': 'right', 'activatePane': false, 'searchAllPanes': true })
    .done(function(railsTestRunnerView) {
      if (railsTestRunnerView.protocol == 'test-runner-output') {
        console.log(railsTestRunnerView);
        railsTestRunnerView.run();
        previousActivePane.activate();
      }
    });
  }

};
