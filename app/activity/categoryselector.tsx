import { Autocomplete, AutocompleteItem, Chip } from "@nextui-org/react";
import { KeyboardEvent, useState } from "react";

type Category = {
  name: string;
};

export function CategorySelector() {
  const [categoryNames, setCategoryNames] = useState<Category[]>([]);
  const [categoryInput, setCategoryInput] = useState<string>("");

  const addCategory = (category: Category) => {
    if (categoryNames.filter((c) => c.name == category.name).length == 0) {
      setCategoryNames(categoryNames.concat([category]));
      setCategoryInput(""); // clear input
    }
  };

  const removeCategory = (name: string) => {
    const modified = categoryNames.filter((c) => c.name != name);
    setCategoryNames(modified);
  };

  return (
    <>
      <div className="flex gap-2 items-center max-w-[400px] overflow-x-auto">
        <span>Categories</span>
        {Array.from(categoryNames).map((category, index) => (
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
        items={categoryNames}
        inputValue={categoryInput}
        onKeyDown={(e: KeyboardEvent) => {
          // TODO see if theres a way to get default handler or ctrl+a
          if (e.key.length == 1) {
            // jank way to determine if printable letter
            setCategoryInput(categoryInput + e.key);
          } else if (e.key == "Enter" && categoryInput.length > 0) {
            addCategory({ name: categoryInput });
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
        {(category: Category) => (
          <AutocompleteItem key={category.name}>
            {category.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </>
  );
}
