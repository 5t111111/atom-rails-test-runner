'use babel';

import RailsTestRunnerView from './rails-test-runner-view';
import { CompositeDisposable } from 'atom';

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

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'rails-test-runner:toggle': () => this.toggle()
    }));
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

  toggle() {
    console.log('RailsTestRunner was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
