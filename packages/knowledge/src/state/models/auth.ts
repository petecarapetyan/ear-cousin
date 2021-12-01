import { createModel } from "@captaincodeman/rdx";
import { State, Store } from "../store";
import { createSelector } from "reselect";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/loader"

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
Beware - Roles are not hierarchical, but independent. 
*/
const setDisplayProperties = (roles: Roles) => {
  for (const role in roles) {
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
            console.error(user.displayName + " might want to buy" + item);
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
            dispatch.auth.subscribeRoles();
          } else {
            dispatch.auth.signedOut();
          }
        });
      },

      roles(roles: Roles){
         setDisplayProperties(roles)
      },
      async subscribeRoles() {
        if (store.getState()?.auth?.user?.uid) {
          const uid = ""+store.getState().auth.user?.uid;
          const userRef = doc(db, "users", uid);
          const userSnapshot = await getDoc(userRef);
          const userRoles = <UserRoles> userSnapshot.data()
          const roles = <Roles> JSON.parse(userRoles.roles)

          store.getDispatch().auth.roles(roles);
          store.getDispatch().knowledge.crudMode('r');
          // MODIFY MANUALLY
          store.getDispatch().knowledge.populateKnowledges();
        }
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
