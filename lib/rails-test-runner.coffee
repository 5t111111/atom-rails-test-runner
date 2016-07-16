RailsTestRunnerView = require './rails-test-runner-view'
{ CompositeDisposable } = require 'atom'
url = require 'url'

module.exports =
  railsTestRunnerView: null
  subscriptions: null

  activate: (state) ->
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.commands.add 'atom-workspace',
      'rails-test-runner:run': =>
        @run()

    atom.workspace.addOpener (uriToOpen) ->
      { protocol, pathname } = url.parse(uriToOpen)
      return unless protocol is 'rails-test-runner-output:'
      new RailsTestRunnerView(pathname)

  deactivate: ->
    @railsTestRunnerView.destroy()
    @subscriptions.dispose()

  serialize: ->
    railsTestRunnerViewState: @railsTestRunnerView.serialize()

  openUriFor: (file) ->
    previousActivePane = atom.workspace.getActivePane()
    uri = "rails-test-runner-output://#{file}"
    atom.workspace.open(uri, split: 'right', activatePane: false, searchAllPanes: true).done (railsTestRunnerView) ->
      if railsTestRunnerView instanceof RailsTestRunnerView
        railsTestRunnerView.run()
        previousActivePane.activate()

  run: ->
    console.log "RUN"
    editor = atom.workspace.getActiveTextEditor()
    return unless editor?
    @openUriFor(editor.getPath())
