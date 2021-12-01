import { css } from "lit";

/*
After you have established your top level roles
they can be added here - hardcoded but helpful
as convenience classes to be consumed like
<div class="if-user">My stuff that shows only for a user</div>
*/
export const cssVars = css`
  [if-user] {
    display: var(--display-if-user, none);
  }
  [if-not-user] {
    display: var(--display-if-not-user, block);
  }
  [if-moderator] {
    display: var(--display-if-moderator, none);
  }
  [if-not-moderator] {
    display: var(--display-if-not-moderator, block);
  }
  [if-admin] {
    display: var(--display-if-admin, none);
  }
  [if-not-admin] {
    display: var(--display-if-not-admin, block);
  }
  [if-superadmin] {
    display: var(--display-if-superadmin, none);
  }
  [if-not-superadmin] {
    display: var(--display-if-not-superadmin, block);
  }
  [if-c] {
    display: var(--display-if-c, none);
  }
  [if-not-c] {
    display: var(--display-if-not-c, block);
  }
  [if-r] {
    display: var(--display-if-r, none);
  }
  [if-not-r] {
    display: var(--display-if-not-r, block);
  }
  [if-u] {
    display: var(--display-if-u, none);
  }
  [if-not-u] {
    display: var(--display-if-not-u, block);
  }
  [if-d] {
    display: var(--display-if-d, none);
  }
  [if-not-d] {
    display: var(--display-if-not-d, block);
  }
`;
