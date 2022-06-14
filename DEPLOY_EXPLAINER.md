# Explainer

This is starting out as intentionally spare, I can improve later if appropriate

The `auth` module is used here as the example, but could have just as easily been cohort or another

## How are the various modules packaged?

Each module must be built into a js module such as for auth `ccfbAuth.js`

Also `ccfbAuth.map.js` is created but that is a side effect.

Here is where this file is created in the `rollup.config.js`, at build time

```output: {
    file: targetDir +'/ccfbAuth.js',
    format: 'esm',
    sourcemap: true,
  },
```

## What file is created where by what?

The above rollup is run by `npm promote` in the `/packages.auth`

Which in turn creates the two files below in `/packages/ccfb/docs`

- `wcfbAuth.js`
- `wcfbAuth.map.js`

## How is this module consumed?

For examples of how a markdown file imports such a mile search for `js script` in the appropriate folder such as `/packages/ccfb/docs`

In the auth instance, if it were imported somewhere it would be `import '/wcfbAuth.js';`