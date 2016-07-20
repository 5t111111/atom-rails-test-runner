{ $, $$$, ScrollView } = require 'atom-space-pen-views'
path = require 'path'
ChildProcess  = require 'child_process'

class RailsTestRunnerView extends ScrollView
  @content: ->
    @div class: 'rails-test-runner', tabindex: -1, =>
      @div class: 'rails-test-runner__spinner', 'Starting test runner...'
      @pre class: 'rails-test-runner__output'

  constructor: (filePath) ->
    super
    @filePath = filePath
    @output  = @find('.rails-test-runner__output')
    @spinner = @find('.rails-test-runner__spinner')

  getTitle: ->
    "rails-test-runner - #{path.basename(@filePath)}"

  getURI: ->
    "rails-test-runner-output://#{@filePath}"

  showError: (result) ->
    @html $$$ ->
      @h2 'Running rails-test-runner Failed'
      @h3 'An error occurred on running a test'
      @div result

  run: (lineNumber) ->
    @spinner.show()
    @output.empty()

    # Get the project root and the relative path to the project.
    [projectPath, relativePath] = atom.project.relativizePath(@filePath)
    if !projectPath
      @showError "File #{@filePath} is not part of a project"
      return

    spawn = ChildProcess.spawn

    testCommand = 'bin/rails test'
    command = "#{testCommand} #{@filePath}"
    command = "#{command}:#{lineNumber}" if lineNumber

    terminal = spawn('bash', ['-l'])

    terminal.on 'close', @onClose

    terminal.stdout.on 'data', @onStdOut
    terminal.stderr.on 'data', @onStdErr

    terminal.stdin.write("cd #{projectPath} && #{command}\n")
    terminal.stdin.write("exit\n")

  addOutput: (output) =>
    escaped_output = $('<div/>').text(output).html()
    @spinner.hide()
    @output.append("#{escaped_output}")
    @scrollTop(@[0].scrollHeight)

  onStdOut: (data) =>
    @addOutput data

  onStdErr: (data) =>
    @addOutput data

  onClose: (code) =>
    console.log "[rails-test-runner] exit with code: #{code}" unless code == 0

module.exports = RailsTestRunnerView
