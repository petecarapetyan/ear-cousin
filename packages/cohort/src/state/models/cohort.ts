import { createModel } from '@captaincodeman/rdx'
import { State, Store  } from '../store'
import { createSelector } from 'reselect'
import { doc, collection, getDocs, getDoc, query, setDoc, deleteDoc, addDoc, DocumentData } from "firebase/firestore";
import { db } from "../firebase/loader"
import { CRUDmode } from "../../type";

interface CohortState {
  focusDcmnt: {};
  cohorts: {};
  crudMode: CRUDmode;
}

export interface Cohort {
    id: string,
    foo:  | null,
    bar:  | null,
    yada:  | null,
}

const getPath = (store: Store) => {
  if (store.getState()?.auth?.user?.uid) {
    return `cohorts`;
  } else {
    return null;
  }
}

export default createModel({
  state: <CohortState>{
    focusDcmnt: {},
    cohorts: {},
    crudMode: "r",
  },

  reducers: {
    cohorts(state, cohorts) {
      return { ...state, cohorts };
    },
    focusDcmnt(state, focusDcmnt) {
      return { ...state, focusDcmnt };
    },
    crudMode(state, crudMode) {
      return { ...state, crudMode };
    },

    //find one that is working, pete
    upsert(state, cohort: Cohort) {
      const cohorts = state.cohorts;
      cohorts[cohort.id] = cohort;
      return  { ...state, cohorts };
    },
    
    deleteDcmnt(state, key: string) {
      const cohorts = state.cohorts;
      delete cohorts[key];
      return { ...state, cohorts};
    }

  },

  effects: (store: Store) => ({

    async populateCohorts() {
      const dispatch = store.getDispatch();
      const path = getPath(store);
      if (path) {
        const cohortRef = collection(db, path);
        const querySnapshot = await getDocs(query(cohortRef));
        querySnapshot.forEach((doc) => {
          const docData = <DocumentData> doc.data();
          const cohort = <Cohort> docData;
          cohort.id=doc.id;
          dispatch.cohort.upsert(cohort)
        });
      }
    },        

    async create(data: Cohort) {
      const path = getPath(store);
      if (path) {
        const cohortRef = collection(db, path);
        if (cohortRef!!) {
          const docRef = await addDoc(collection(db, path), data);
          console.error("ADDED cohort ID", docRef.id);
        }
        store.getDispatch().cohort.populateCohorts();
        store.getDispatch().cohort.crudMode('r')
        window.location.reload();
      }
    },

    async delete(key: string) {
      const path = `${getPath(store)}/${key}`;
      if (path) {
        const cohortRef = doc(db, path);
        if (cohortRef!!) {
          await deleteDoc(doc(db, path));
          store.getDispatch().cohort.deleteDcmnt(key)
          window.location.reload();
        }
      }
    },

    async loadUpdateView(key: any) {
      const path = `${getPath(store)}/${key}`;
      if (path) {
        const cohortRef = doc(db, path);
        if (cohortRef!!) {
          const docSnap = await getDoc(cohortRef);
          const data = docSnap.data()
          if(data!! && docSnap.id!!){
            const cohort: Cohort = {
              id: docSnap.id,
                foo: data["foo"],
                bar: data["bar"],
                yada: data["yada"],
              };
            store.getDispatch().cohort.focusDcmnt(cohort);
          }else{
            //throw exception or do something here
          }
        }
      }
    },

    async updateDcmnt(data: Cohort) {
      const path = `${getPath(store)}/${data.id}`;
      if (path) {
        const cohortRef = doc(db, path);
        if (cohortRef!!) {
          await setDoc(doc(db, path), data);
          window.location.reload();
        }
      }
    },

    async crudMode(crudMode: CRUDmode) {
      document.documentElement.style.setProperty(
        `--display-if-c`, crudMode==='c'?"block":"none");
      document.documentElement.style.setProperty(
          `--display-if-r`, crudMode==='r'?"block":"none");
      document.documentElement.style.setProperty(
            `--display-if-u`, crudMode==='u'?"block":"none");
      document.documentElement.style.setProperty(
              `--display-if-d`, crudMode==='d'?"block":"none");

      document.documentElement.style.setProperty(
        `--display-if-not-c`, crudMode!=='c'?"block":"none");
      document.documentElement.style.setProperty(
          `--display-if-not-r`, crudMode!=='r'?"block":"none");
      document.documentElement.style.setProperty(
            `--display-if-not-u`, crudMode!=='u'?"block":"none");
      document.documentElement.style.setProperty(
              `--display-if-not-d`, crudMode!=='d'?"block":"none");
    },
  })
})

// see ../index.ts for where state.cohort below,
// is defined using default export from above
const getState = (state: State) => state.cohort;

// creates methods such as `CohortSelectors.someval(state)`
// which would typically return state.someval
export namespace CohortSelectors {
  export const cohortFocus = createSelector(
    [getState],
    (state) => state.focusDcmnt
  )
  export const cohorts = createSelector(
    [getState],
    (state) => state.cohorts
  )
  export const crudMode = createSelector([getState], (state) => state.crudMode);
}
