
# Contributing

Contributions to Marketing Roadmaps are welcome. You can suggest topics, report bugs, improve learning resources, correct errors, and submit proposed changes for review.

The project owner retains control over the official codebase. All contributions require review and approval before they become part of the official project.

The project licence governs how you may access and use the code. Forking a repository or submitting a pull request does not grant permission to publish or distribute modified versions of the software.

## Let's Get Started

1. Fork the repository to prepare a proposed contribution.
2. Clone your fork and open the folder in VS Code.
3. Run the project with Live Server or open `index.html`.
4. Edit the relevant roadmap data file in `js/data/`.
5. Run `node scripts/validate.mjs` and fix any reported errors.
6. Open a pull request against the official repository and complete the pull request template.

Changes in your fork remain proposals until they have been reviewed and accepted.

## Edit a topic

Each topic is an object in its track's data file:

```js
{
  id: 'positioning',
  title: 'Positioning',
  stage: 'Foundation',
  level: 'beginner',
  prereqs: ['fundamentals'],
  summary: 'One sentence, 160 characters at most.',
  resources: [
    {
      title: 'Obviously Great',
      type: 'book',
      cost: 'free',
      author: 'Marketing Butterfly'
    }
  ]
}
```

- `id` must be unique within the track and use lower-case kebab case. Changing an id resets saved progress for users, so avoid changing existing ids.
- `prereqs` lists topic ids in the same track that should come first. Circular dependencies are not allowed.
- `stage` and `level` should match the surrounding topics. Stage labels appear above the columns.
- Add `optional: true` for topics that improve the learning path without being essential.

## Add a topic

Add an object to the relevant array, assign a unique id and list its prerequisites. The layout updates automatically.

Connect the new topic to the learning path by adding its id to the `prereqs` of a later topic, where appropriate.

## Propose a new roadmap

1. Copy an existing file in `js/data/` to `js/data/yourtrack.js` in your fork and change the `window.TOPICS.<id>` key.
2. Add `<script src="js/data/yourtrack.js"></script>` to `index.html` before `layout.js`.
3. Add an entry to `js/data/tracks.js` with the same id and `status: 'live'`, if the proposed roadmap is ready for release.
4. Run the validation script and submit a pull request for review.

The validation script checks that the required files and references are present. Roadmaps are not considered part of the official project until the project owner or an authorised maintainer approves and merges them.

## Quality standards for resources

- Mark every resource as `free` or `paid`, and list free resources first.
- We prefer primary sources, official documentation, and well-regarded books over blog posts.
- Add a `url` only after opening and checking the destination.
- Do not submit affiliate links.
- Explain in the pull request why you are adding more than three resources to a single topic.
- Please, do not copy text from books, courses, or articles. Write summaries in your own words.

## Review and approval

Pull requests are checked by the validation workflow and reviewed by the project owner or an authorised maintainer.

Small fixes may be accepted quickly. Structural changes, including moving topics or changing prerequisites, may require discussion because they affect the learning path and saved progress.

The project owner or authorised maintainers decide which contributions to accept, revise, defer, or reject. Contributors must not merge changes into the official repository unless they have been granted the necessary access.

## Suggest changes without coding

Open an issue using the "Suggest a topic or fix" template.

You can suggest new topics, report factual errors, recommend learning resources, or explain where a roadmap could be improved. You do not need to write code to contribute.

**If you don't want to go through the hassle, you can just send your contribution in an email to marketingbutterfly@gmail.com**

## Licence and ownership

Contributions are governed by the project's licence and any applicable contribution terms.

Submitting a pull request does not transfer ownership of your original work to the project owner. It grants permission for an accepted contribution to be incorporated into and distributed as part of Marketing Roadmaps.

Marketing Butterfly retains control over the official project, its releases, and the decision to accept contributions.
