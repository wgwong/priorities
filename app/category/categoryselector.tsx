import { Autocomplete, AutocompleteItem, Chip } from "@nextui-org/react";
import { Dispatch, KeyboardEvent, SetStateAction, useState } from "react";
import { CategorySelectorTag } from "../types";

type Props = {
  tags: CategorySelectorTag[];
  setTags: Dispatch<SetStateAction<CategorySelectorTag[]>>;
};

export function CategorySelector({ tags, setTags }: Props) {
  const [categoryInput, setCategoryInput] = useState<string>("");

  const addCategory = (category: CategorySelectorTag) => {
    if (tags.filter((c) => c.name == category.name).length == 0) {
      setTags(tags.concat([category]));
      setCategoryInput(""); // clear input
    }
  };

  const removeCategory = (name: string) => {
    const modified = tags.filter((c) => c.name != name);
    setTags(modified);
  };

  return (
    <>
      <div className="flex gap-2 items-center max-w-[400px] overflow-x-auto">
        <span>Categories</span>
        {Array.from(tags).map((category, index) => (
          <Chip
            key={index}
            onClose={() => removeCategory(category.name)}
            variant="flat"
          >
            {category.name}
          </Chip>
        ))}
      </div>
      <Autocomplete
        allowsCustomValue
        label="Add new or existing category(s)"
        variant="bordered"
        items={tags}
        inputValue={categoryInput}
        onKeyDown={(e: KeyboardEvent) => {
          // TODO see if theres a way to get default handler or ctrl+a
          if (e.key.length == 1) {
            // jank way to determine if printable letter
            setCategoryInput(categoryInput + e.key);
          } else if (e.key == "Enter" && categoryInput.length > 0) {
            addCategory({ name: categoryInput });
            // don't clear & submit the overall form (which is default behavior)
            e.preventDefault(); // TODO STILL NOT WORKING, BUG
          } else if (e.key == "Backspace") {
            setCategoryInput(categoryInput.slice(0, -1));
          } else {
            console.log("key: ", e);
          }
        }}
        onSelectionChange={(key) => {
          console.log("onSelectionChange key: ", key);
          if (key) {
            addCategory({ name: key as string });
          }
        }}
      >
        {(category: CategorySelectorTag) => (
          <AutocompleteItem key={category.name}>
            {category.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </>
  );
}
