# How to make a CRUD component

- open pete_ploppers in one shell
- open this in another shell
- `cp -R template ../mycrud` from `ccfb/packages`
- make the schema in the README
- change of these to replace fixme in a case sensitive way:
 - - state/models/auth.ts
 - - state/models/index.ts
 - - ui/app-shell
 - - docs/index.html
 - - rollup-config.js
 - - package.json
 - - (optional for re-runs) cleanme.sh
- fix wrong plurals such as:
 - - words like history where plural is same as singular
 - - words already ending in s so that search for ss
- in `auth.ts` if User based, then add a `User` into this line
          `store.getDispatch().event.populate`
          to make it be 
          store.getDispatch().event.populateUser
- 