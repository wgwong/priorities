import { Dispatch, ReactNode, createContext, useReducer } from "react";
import { KeyedCategory } from "./types";

export type CategoryReducerActions =
  | {
      type: "upsert";
      keyedCategory: KeyedCategory;
    }
  | { type: "del"; key: string };

export const CategoryContext = createContext<{
  state: KeyedCategory[];
  dispatch: Dispatch<CategoryReducerActions>;
}>({ state: [], dispatch: () => null });
export const CategoryDispatchContext = createContext(null);

export function categoryReducer(
  keyedCategories: KeyedCategory[],
  action: CategoryReducerActions
) {
  console.log(
    "categoryReducer keyedCategories: ",
    keyedCategories,
    ", action: ",
    action
  );

  switch (action.type) {
    case "upsert": {
      return keyedCategories.concat(action.keyedCategory);
    }
    case "del": {
      return keyedCategories.filter((item) => item.key !== action.key);
    }
    default: {
      throw Error("Unknown CategoryReducerActions action: ", action);
    }
  }
}

export function CategoryProvider({
  children,
  keyedCategories,
}: {
  children: ReactNode;
  keyedCategories: KeyedCategory[];
}) {
  const [categories, dispatch] = useReducer(categoryReducer, keyedCategories);

  return (
    <CategoryContext.Provider value={{ state: categories, dispatch }}>
      {children}
    </CategoryContext.Provider>
  );
}
