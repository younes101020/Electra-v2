import { ITMDBAccoundDetails } from "@/utils/api/tmdb";
import fetcher from "@/utils/http";
import { createStore } from "zustand/vanilla";

// export type CounterActions = {
//   decrementCount: () => void;
//   incrementCount: () => void;
// };

export type CounterStore = ITMDBAccoundDetails;
// & CounterActions;

export const initCounterStore = async (): Promise<ITMDBAccoundDetails> => {
  try {
    const user = await fetcher<ITMDBAccoundDetails>(
      process.env.NEXT_PUBLIC_BASEURL +
        "/api/account/session_id_placeholder/details",
      { method: "GET" },
    );
    console.log("USER FROM CLIENT STORE: ", user);
    return user;
  } catch (error) {
    console.error("Error fetching user account details:", error);
    return defaultInitState;
  }
};

export const defaultInitState: ITMDBAccoundDetails = {
  avatar: {
    gravatar: {
      hash: "",
    },
    tmdb: {
      avatar_path: "",
    },
  },
  id: 0,
  iso_639_1: "",
  iso_3166_1: "",
  name: "Anonymous",
  include_adult: false,
  username: "Anonymous",
};

export const createCounterStore = (initState: Promise<ITMDBAccoundDetails>) => {
  const store = createStore<CounterStore>()((set) => ({
    ...defaultInitState,
    // decrementCount: () => set((state) => ({ count: state.count - 1 })),
    // incrementCount: () => set((state) => ({ count: state.count + 1 })),
  }));
  initState.then(store.setState);
  return store;
};
