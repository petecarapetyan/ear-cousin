import { createModel } from '@captaincodeman/rdx'
import { State, Store  } from '../store'
import { createSelector } from 'reselect'
import { doc, collection, getDocs, getDoc, query, setDoc, deleteDoc, addDoc, DocumentData } from "firebase/firestore";
import { db } from "../firebase/loader"
import { CRUDmode } from "../../type";

interface EventState {
  focusDcmnt: {};
  userEvents: {};
  crudMode: CRUDmode;
}

export interface UserEvent {
    id: string,
    datetime:  | null,
    type:  | null,
    data:  | null,
    ackby:  | null,
    ackdatetime:  | null,
}

const getPath = (store: Store) => {
  if (store.getState()?.auth?.user?.uid) {
    const uid = ""+store.getState().auth.user?.uid;
    return `users/${uid}/events`;
  } else {
    return null;
  }
}

export default createModel({
  state: <EventState>{
    focusDcmnt: {},
    userEvents: {},
    crudMode: "r",
  },

  reducers: {
    userEvents(state, userEvents) {
      return { ...state, userEvents };
    },
    focusDcmnt(state, focusDcmnt) {
      return { ...state, focusDcmnt };
    },
    crudMode(state, crudMode) {
      return { ...state, crudMode };
    },

    //find one that is working, pete
    upsert(state, userEvent: UserEvent) {
      const userEvents = state.userEvents;
      userEvents[userEvent.id] = userEvent;
      return  { ...state, userEvents };
    },
    
    deleteDcmnt(state, key: string) {
      const userEvents = state.userEvents;
      delete userEvents[key];
      return { ...state, userEvents};
    }

  },

  effects: (store: Store) => ({

    async populateUserEvents() {
      const dispatch = store.getDispatch();
      const path = getPath(store);
      if (path) {
        const userEventRef = collection(db, path);
        const querySnapshot = await getDocs(query(userEventRef));
        querySnapshot.forEach((doc) => {
          const docData = <DocumentData> doc.data();
          const userEvent = <UserEvent> docData;
          userEvent.id=doc.id;
          dispatch.event.upsert(userEvent)
        });
      }
    },        

    async create(data: UserEvent) {
      const path = getPath(store);
      if (path) {
        const userEventRef = collection(db, path);
        if (userEventRef!!) {
          const docRef = await addDoc(collection(db, path), data);
          console.error("ADDED userEvent ID", docRef.id);
        }
        store.getDispatch().event.populateUserEvents();
        store.getDispatch().event.crudMode('r')
        window.location.reload();
      }
    },

    async delete(key: string) {
      const path = `${getPath(store)}/${key}`;
      if (path) {
        const userEventRef = doc(db, path);
        if (userEventRef!!) {
          await deleteDoc(doc(db, path));
          store.getDispatch().event.deleteDcmnt(key)
          window.location.reload();
        }
      }
    },

    async loadUpdateView(key: any) {
      const path = `${getPath(store)}/${key}`;
      if (path) {
        const userEventRef = doc(db, path);
        if (userEventRef!!) {
          const docSnap = await getDoc(userEventRef);
          const data = docSnap.data()
          if(data!! && docSnap.id!!){
            const userEvent: UserEvent = {
              id: docSnap.id,
                datetime: data["datetime"],
                type: data["type"],
                data: data["data"],
                ackby: data["ackby"],
                ackdatetime: data["ackdatetime"],
              };
            store.getDispatch().event.focusDcmnt(userEvent);
          }else{
            //throw exception or do something here
          }
        }
      }
    },

    async updateDcmnt(data: UserEvent) {
      const path = `${getPath(store)}/${data.id}`;
      if (path) {
        const userEventRef = doc(db, path);
        if (userEventRef!!) {
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

// see ../index.ts for where state.event below,
// is defined using default export from above
const getState = (state: State) => state.event;

// creates methods such as `EventSelectors.someval(state)`
// which would typically return state.someval
export namespace EventSelectors {
  export const userEventFocus = createSelector(
    [getState],
    (state) => state.focusDcmnt
  )
  export const userEvents = createSelector(
    [getState],
    (state) => state.userEvents
  )
  export const crudMode = createSelector([getState], (state) => state.crudMode);
}
