import { createModel } from "@captaincodeman/rdx";
import { State, Store } from "../store";
import { createSelector } from "reselect";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../firebase/loader"

const provider = new GoogleAuthProvider();

import type { User } from 'firebase/auth'

export interface Roles {
  user: boolean;
}

export interface UserRoles {
  roles: string;
}

export interface AuthState {
  user: User | null;
  statusKnown: boolean;
  roles: Roles | null;
}

/*
This is not designed for careful engineering. 

It does exactly what it says it does, which means
it might mis-interpret your roles object in a different
way than you intended.
*/
const setDisplayProperties = (roles: Roles) => {
  for (const role in roles) {
      console.log(`SHOWING\n${JSON.stringify(role)}`)
      document.documentElement.style.setProperty(
        `--display-if-${role}`,
        roles[role] ? "block" : "none"
      );
      document.documentElement.style.setProperty(
        `--display-if-not-${role}`,
        roles[role] ? "none" : "block"
      );
  }
};

export default createModel({
  state: <AuthState>{
    user: null,
    statusKnown: false,
    roles: null
  },

  reducers: {
    signedIn(state, user: User) {
      // this shouldn't be here but for now...
      for (var i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("page")) {
          const item = localStorage.getItem(key);
          if (!item?.startsWith("/README")) {
            console.log(user.displayName + " might want to buy" + item);
          }
        }
      }
      return { ...state, user, statusKnown: true };
    },

    signedOut(state) {
      return { ...state, user: null, statusKnown: true };
    },
    roles(state, roles: Roles) {
      return { ...state, roles };
    },
  },

  effects(store: Store) {
    return {
      signout() {
        auth.signOut();
      },

      signinProvider() {
        signInWithRedirect(auth, provider);
      },

      // to support signing in with other methods:
      // async signinEmailPassword(payload: { email: string, password: string }) {
      //   const auth = await authLoader
      //   await auth.signInWithEmailAndPassword(payload.email, payload.password)
      // },

      init() {
        const dispatch = store.getDispatch();

        auth.onAuthStateChanged(async (user) => {
          if (user) {
            dispatch.auth.signedIn(user);
          } else {
            dispatch.auth.signedOut();
          }
        });
      },

      roles(roles: Roles){
         setDisplayProperties(roles)
      },
    };
  },
});

const getState = (state: State) => state.auth;

export namespace AuthSelectors {
  export const user = createSelector([getState], (state) => state.user);

  export const statusKnown = createSelector(
    [getState],
    (state) => state.statusKnown
  );

  export const roles = createSelector(
    [getState],
    (state) => state.roles
  );

  export const anonymous = createSelector([user], (user) => user === null);

  export const authenticated = createSelector([user], (user) => user !== null);
}
