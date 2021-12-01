import { createModel } from '@captaincodeman/rdx'
import { State, Store  } from '../store'
import { createSelector } from 'reselect'
import { doc, collection, getDocs, getDoc, query, setDoc, deleteDoc, addDoc, DocumentData } from "firebase/firestore";
import { db } from "../firebase/loader"
import { CRUDmode } from "../../type";

interface PersonState {
  focusDcmnt: {};
  persons: {};
  crudMode: CRUDmode;
}

export interface Person {
    id: string,
    fname:  | null,
    lname:  | null,
    email:  | null,
    datecreated:  | null,
    currentstatus:  | null,
    cohortlu:  | null,
}

const getPath = (store: Store) => {
  if (store.getState()?.auth?.user?.uid) {
    return `persons`;
  } else {
    return null;
  }
}

export default createModel({
  state: <PersonState>{
    focusDcmnt: {},
    persons: {},
    crudMode: "r",
  },

  reducers: {
    persons(state, persons) {
      return { ...state, persons };
    },
    focusDcmnt(state, focusDcmnt) {
      return { ...state, focusDcmnt };
    },
    crudMode(state, crudMode) {
      return { ...state, crudMode };
    },

    //find one that is working, pete
    upsert(state, person: Person) {
      const persons = state.persons;
      persons[person.id] = person;
      return  { ...state, persons };
    },
    
    deleteDcmnt(state, key: string) {
      const persons = state.persons;
      delete persons[key];
      return { ...state, persons};
    }

  },

  effects: (store: Store) => ({

    async populatePersons() {
      const dispatch = store.getDispatch();
      const path = getPath(store);
      if (path) {
        const personRef = collection(db, path);
        const querySnapshot = await getDocs(query(personRef));
        querySnapshot.forEach((doc) => {
          const docData = <DocumentData> doc.data();
          const person = <Person> docData;
          person.id=doc.id;
          dispatch.person.upsert(person)
        });
      }
    },        

    async create(data: Person) {
      const path = getPath(store);
      if (path) {
        const personRef = collection(db, path);
        if (personRef!!) {
          const docRef = await addDoc(collection(db, path), data);
          console.error("ADDED person ID", docRef.id);
        }
        store.getDispatch().person.populatePersons();
        store.getDispatch().person.crudMode('r')
        window.location.reload();
      }
    },

    async delete(key: string) {
      const path = `${getPath(store)}/${key}`;
      if (path) {
        const personRef = doc(db, path);
        if (personRef!!) {
          await deleteDoc(doc(db, path));
          store.getDispatch().person.deleteDcmnt(key)
          window.location.reload();
        }
      }
    },

    async loadUpdateView(key: any) {
      const path = `${getPath(store)}/${key}`;
      if (path) {
        const personRef = doc(db, path);
        if (personRef!!) {
          const docSnap = await getDoc(personRef);
          const data = docSnap.data()
          if(data!! && docSnap.id!!){
            const person: Person = {
              id: docSnap.id,
                fname: data["fname"],
                lname: data["lname"],
                email: data["email"],
                datecreated: data["datecreated"],
                currentstatus: data["currentstatus"],
                cohortlu: data["cohortlu"],
              };
            store.getDispatch().person.focusDcmnt(person);
          }else{
            //throw exception or do something here
          }
        }
      }
    },

    async updateDcmnt(data: Person) {
      const path = `${getPath(store)}/${data.id}`;
      if (path) {
        const personRef = doc(db, path);
        if (personRef!!) {
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

// see ../index.ts for where state.person below,
// is defined using default export from above
const getState = (state: State) => state.person;

// creates methods such as `PersonSelectors.someval(state)`
// which would typically return state.someval
export namespace PersonSelectors {
  export const personFocus = createSelector(
    [getState],
    (state) => state.focusDcmnt
  )
  export const persons = createSelector(
    [getState],
    (state) => state.persons
  )
  export const crudMode = createSelector([getState], (state) => state.crudMode);
}
