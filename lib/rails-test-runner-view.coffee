{ $, $$$, EditorView, ScrollView } = require 'atom-space-pen-views'
path = require 'path'
ChildProcess  = require 'child_process'

class RailsTestRunnerView extends ScrollView
  atom.deserializers.add(this)

  @deserialize: ({ filePath }) ->
    new RailsTestRunnerView(filePath)

  @content: ->
    @div class: 'rails-test-runner rails-test-runner-console', tabindex: -1, =>
      @div class: 'rails-test-runner-spinner', 'Starting rails-test-runner...'
      @pre class: 'rails-test-runner-output'

  # initialize: ->
  #   super
  #   @on 'core:copy': => @copySelectedText()

  constructor: (filePath) ->
    super
    console.log "File path:", filePath
    @filePath = filePath

    @output  = @find(".rails-test-runner-output")
    @spinner = @find(".rails-test-runner-spinner")
    @output.on("click", @terminalClicked)

  serialize: ->
    deserializer: 'RailsTestRunnerView'
    filePath: @getPath()

  # copySelectedText: ->
  #   text = window.getSelection().toString()
  #   return if text == ''
  #   atom.clipboard.write(text)

  getTitle: ->
    "rails-test-runner - #{path.basename(@getPath())}"

  getURI: ->
    "rails-test-runner-output://#{@getPath()}"

  getPath: ->
    @filePath

  # showError: (result) ->
  #   failureMessage = "The error message"
  #
  #   @html $$$ ->
  #     @h2 'Running rails-test-runner Failed'
  #     @h3 failureMessage if failureMessage?
  #
  # terminalClicked: (e) =>
  #   if e.target?.href
  #     line = $(e.target).data('line')
  #     file = $(e.target).data('file')
  #     console.log(file)
  #     file = "#{atom.project.getPaths()[0]}/#{file}"
  #
  #     promise = atom.workspace.open(file, { searchAllPanes: true, initialLine: line })
  #     promise.done (editor) ->
  #       editor.setCursorBufferPosition([line-1, 0])

  run: () ->
    console.log 'view run'
    # atom.workspace.saveAll() if atom.config.get("rails-test-runner.save_before_run")
    @spinner.show()
    @output.empty()
    projectPath = atom.project.getPaths()[0]

    spawn = ChildProcess.spawn

    # Atom saves config based on package name, so we need to use rails-test-runner here.
    # specCommand = atom.config.get("rails-test-runner.command")
    # options = " --tty"
    # options += " --color" if atom.config.get("rails-test-runner.force_colored_results")
    testCommand = 'bin/rails test'
    command = "#{testCommand} #{@filePath}"
    # command = "#{command}:#{lineNumber}" if lineNumber
    #
    console.log "[rails-test-runner] running: #{command}"

    terminal = spawn("bash", ["-l"])

    terminal.on 'close', @onClose

    terminal.stdout.on 'data', @onStdOut
    terminal.stderr.on 'data', @onStdErr

    terminal.stdin.write("cd #{projectPath} && #{command}\n")
    terminal.stdin.write("exit\n")

  addOutput: (output) =>
    # formatter = new TextFormatter(output)
    # output = formatter.htmlEscaped().colorized().fileLinked().text

    @spinner.hide()
    @output.append("#{output}")
    @scrollTop(@[0].scrollHeight)

  onStdOut: (data) =>
    @addOutput data

  onStdErr: (data) =>
    @addOutput data

  onClose: (code) =>
    console.log "[rails-test-runner] exit with code: #{code}"

module.exports = RailsTestRunnerView
