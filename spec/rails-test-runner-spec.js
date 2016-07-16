'use babel';

import RailsTestRunner from '../lib/rails-test-runner';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('RailsTestRunner', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('rails-test-runner');
  });

  describe('when the rails-test-runner:run event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.rails-test-runner')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'rails-test-runner:run');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.rails-test-runner')).toExist();

        let railsTestRunnerElement = workspaceElement.querySelector('.rails-test-runner');
        expect(railsTestRunnerElement).toExist();

        let railsTestRunnerPanel = atom.workspace.panelForItem(railsTestRunnerElement);
        expect(railsTestRunnerPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'rails-test-runner:run');
        expect(railsTestRunnerPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.rails-test-runner')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'rails-test-runner:run');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let railsTestRunnerElement = workspaceElement.querySelector('.rails-test-runner');
        expect(railsTestRunnerElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'rails-test-runner:run');
        expect(railsTestRunnerElement).not.toBeVisible();
      });
    });
  });
});
