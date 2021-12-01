import { createModel } from '@captaincodeman/rdx'
import { State, Store  } from '../store'
import { createSelector } from 'reselect'
import { doc, collection, getDocs, getDoc, query, setDoc, deleteDoc, addDoc, DocumentData } from "firebase/firestore";
import { db } from "../firebase/loader"
import { CRUDmode } from "../../type";

interface SyllabusluState {
  focusDcmnt: {};
  syllabuslus: {};
  crudMode: CRUDmode;
}

export interface Syllabuslu {
    id: string,
    foo:  | null,
    bar:  | null,
    meh:  | null,
}

const getPath = (store: Store) => {
  if (store.getState()?.auth?.user?.uid) {
    return `syllabuslus`;
  } else {
    return null;
  }
}

export default createModel({
  state: <SyllabusluState>{
    focusDcmnt: {},
    syllabuslus: {},
    crudMode: "r",
  },

  reducers: {
    syllabuslus(state, syllabuslus) {
      return { ...state, syllabuslus };
    },
    focusDcmnt(state, focusDcmnt) {
      return { ...state, focusDcmnt };
    },
    crudMode(state, crudMode) {
      return { ...state, crudMode };
    },

    //find one that is working, pete
    upsert(state, syllabuslu: Syllabuslu) {
      const syllabuslus = state.syllabuslus;
      syllabuslus[syllabuslu.id] = syllabuslu;
      return  { ...state, syllabuslus };
    },
    
    deleteDcmnt(state, key: string) {
      const syllabuslus = state.syllabuslus;
      delete syllabuslus[key];
      return { ...state, syllabuslus};
    }

  },

  effects: (store: Store) => ({

    async populateSyllabuslus() {
      const dispatch = store.getDispatch();
      const path = getPath(store);
      if (path) {
        const syllabusluRef = collection(db, path);
        const querySnapshot = await getDocs(query(syllabusluRef));
        querySnapshot.forEach((doc) => {
          const docData = <DocumentData> doc.data();
          const syllabuslu = <Syllabuslu> docData;
          syllabuslu.id=doc.id;
          dispatch.syllabuslu.upsert(syllabuslu)
        });
      }
    },        

    async create(data: Syllabuslu) {
      const path = getPath(store);
      if (path) {
        const syllabusluRef = collection(db, path);
        if (syllabusluRef!!) {
          const docRef = await addDoc(collection(db, path), data);
          console.error("ADDED syllabuslu ID", docRef.id);
        }
        store.getDispatch().syllabuslu.populateSyllabuslus();
        store.getDispatch().syllabuslu.crudMode('r')
        window.location.reload();
      }
    },

    async delete(key: string) {
      const path = `${getPath(store)}/${key}`;
      if (path) {
        const syllabusluRef = doc(db, path);
        if (syllabusluRef!!) {
          await deleteDoc(doc(db, path));
          store.getDispatch().syllabuslu.deleteDcmnt(key)
          window.location.reload();
        }
      }
    },

    async loadUpdateView(key: any) {
      const path = `${getPath(store)}/${key}`;
      if (path) {
        const syllabusluRef = doc(db, path);
        if (syllabusluRef!!) {
          const docSnap = await getDoc(syllabusluRef);
          const data = docSnap.data()
          if(data!! && docSnap.id!!){
            const syllabuslu: Syllabuslu = {
              id: docSnap.id,
                foo: data["foo"],
                bar: data["bar"],
                meh: data["meh"],
              };
            store.getDispatch().syllabuslu.focusDcmnt(syllabuslu);
          }else{
            //throw exception or do something here
          }
        }
      }
    },

    async updateDcmnt(data: Syllabuslu) {
      const path = `${getPath(store)}/${data.id}`;
      if (path) {
        const syllabusluRef = doc(db, path);
        if (syllabusluRef!!) {
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

// see ../index.ts for where state.syllabuslu below,
// is defined using default export from above
const getState = (state: State) => state.syllabuslu;

// creates methods such as `SyllabusluSelectors.someval(state)`
// which would typically return state.someval
export namespace SyllabusluSelectors {
  export const syllabusluFocus = createSelector(
    [getState],
    (state) => state.focusDcmnt
  )
  export const syllabuslus = createSelector(
    [getState],
    (state) => state.syllabuslus
  )
  export const crudMode = createSelector([getState], (state) => state.crudMode);
}
