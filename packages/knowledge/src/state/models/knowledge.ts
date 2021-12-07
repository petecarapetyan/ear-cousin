import { createModel } from '@captaincodeman/rdx'
import { State, Store  } from '../store'
import { createSelector } from 'reselect'
import { doc, collection, getDocs, getDoc, query, setDoc, deleteDoc, addDoc, DocumentData } from "firebase/firestore";
import { db } from "../firebase/loader"
import { CRUDmode } from "../../type";

interface KnowledgeState {
  focusDcmnt: {};
  knowledges: {};
  crudMode: CRUDmode;
}

export interface Knowledge {
    id: string,
    foo:  | null,
    bar:  | null,
    yada:  | null,
}

const getPath = (store: Store) => {
  if (store.getState()?.auth?.user?.uid) {
    return `knowledges`;
  } else {
    return null;
  }
}

export default createModel({
  state: <KnowledgeState>{
    focusDcmnt: {},
    knowledges: {},
    crudMode: "r",
  },

  reducers: {
    knowledges(state, knowledges) {
      return { ...state, knowledges };
    },
    focusDcmnt(state, focusDcmnt) {
      return { ...state, focusDcmnt };
    },
    crudMode(state, crudMode) {
      return { ...state, crudMode };
    },

    //find one that is working, pete
    upsert(state, knowledge: Knowledge) {
      const knowledges = state.knowledges;
      knowledges[knowledge.id] = knowledge;
      return  { ...state, knowledges };
    },
    
    deleteDcmnt(state, key: string) {
      const knowledges = state.knowledges;
      delete knowledges[key];
      return { ...state, knowledges};
    }

  },

  effects: (store: Store) => ({

    async populateKnowledges() {
      const dispatch = store.getDispatch();
      const path = getPath(store);
      if (path) {
        const knowledgeRef = collection(db, path);
        const querySnapshot = await getDocs(query(knowledgeRef));
        querySnapshot.forEach((doc) => {
          const docData = <DocumentData> doc.data();
          const knowledge = <Knowledge> docData;
          knowledge.id=doc.id;
          dispatch.knowledge.upsert(knowledge)
        });
      }
    },        

    async create(data: Knowledge) {
      const path = getPath(store);
      if (path) {
        const knowledgeRef = collection(db, path);
        if (knowledgeRef!!) {
          const docRef = await addDoc(collection(db, path), data);
          console.error("ADDED knowledge ID", docRef.id);
        }
        store.getDispatch().knowledge.populateKnowledges();
        store.getDispatch().knowledge.crudMode('r')
        window.location.reload();
      }
    },

    async delete(key: string) {
      const path = `${getPath(store)}/${key}`;
      if (path) {
        const knowledgeRef = doc(db, path);
        if (knowledgeRef!!) {
          await deleteDoc(doc(db, path));
          store.getDispatch().knowledge.deleteDcmnt(key)
          window.location.reload();
        }
      }
    },

    async loadUpdateView(key: any) {
      const path = `${getPath(store)}/${key}`;
      if (path) {
        const knowledgeRef = doc(db, path);
        if (knowledgeRef!!) {
          const docSnap = await getDoc(knowledgeRef);
          const data = docSnap.data()
          if(data!! && docSnap.id!!){
            const knowledge: Knowledge = {
              id: docSnap.id,
                foo: data["foo"],
                bar: data["bar"],
                yada: data["yada"],
              };
            store.getDispatch().knowledge.focusDcmnt(knowledge);
          }else{
            //throw exception or do something here
          }
        }
      }
    },

    async updateDcmnt(data: Knowledge) {
      const path = `${getPath(store)}/${data.id}`;
      if (path) {
        const knowledgeRef = doc(db, path);
        if (knowledgeRef!!) {
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

// see ../index.ts for where state.knowledge below,
// is defined using default export from above
const getState = (state: State) => state.knowledge;

// creates methods such as `KnowledgeSelectors.someval(state)`
// which would typically return state.someval
export namespace KnowledgeSelectors {
  export const knowledgeFocus = createSelector(
    [getState],
    (state) => state.focusDcmnt
  )
  export const knowledges = createSelector(
    [getState],
    (state) => state.knowledges
  )
  export const crudMode = createSelector([getState], (state) => state.crudMode);
}
