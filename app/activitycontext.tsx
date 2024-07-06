import { Dispatch, ReactNode, createContext, useReducer } from "react";
import { KeyedActivity } from "./types";

export const ActivityContext = createContext<{
  state: KeyedActivity[];
  dispatch: Dispatch<ActivityReducerActions>;
}>({ state: [], dispatch: () => null });
export const ActivityDispatchContext = createContext(null);

export type ActivityReducerActions =
  | {
      type: "upsert";
      keyedActivity: KeyedActivity;
    }
  | { type: "del"; key: string };

export function activityReducer(
  keyedActivities: KeyedActivity[],
  action: ActivityReducerActions
) {
  console.log(
    "activityReducer keyedActivities: ",
    keyedActivities,
    ", action: ",
    action
  );

  switch (action.type) {
    case "upsert": {
      return keyedActivities.concat(action.keyedActivity);
    }
    case "del": {
      return keyedActivities.filter((item) => item.key !== action.key);
    }
    default: {
      throw Error("Unknown ActivityReducerActions action: ", action);
    }
  }
}

export function ActivityProvider({
  children,
  keyedActivities,
}: {
  children: ReactNode;
  keyedActivities: KeyedActivity[];
}) {
  const [activities, dispatch] = useReducer(activityReducer, keyedActivities);

  return (
    <ActivityContext.Provider value={{ state: activities, dispatch }}>
      {children}
    </ActivityContext.Provider>
  );
}
