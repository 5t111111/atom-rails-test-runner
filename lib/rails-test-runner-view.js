'use babel';

import { ScrollView } from 'atom-space-pen-views';

export default class RailsTestRunnerView extends ScrollView {

  // atom.deserializers.add(this);
  //
  // @deserialize: ({filePath}) ->
  // new RSpecView(filePath)

  initialize() {
    super.initialize();
  }

  constructor(filePath) {
    // // Create root element
    // this.element = document.createElement('div');
    // this.element.classList.add('rails-test-runner');
    //
    // // Create message element
    // const message = document.createElement('div');
    // message.textContent = 'The RailsTestRunner package is Alive! It\'s ALIVE!';
    // message.classList.add('message');
    // this.element.appendChild(message);
    super(filePath);
    this.content = document.createElement('div');
    console.log("File path:", filePath);
    this.text = "fxxk";
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  run() {
    this.element.show();
  }

  getTitle() {
    return 'title!';
  }

  getURI() {
    return 'uri!';
  }

  getPath() {
    return 'filepath!';
  }
}
