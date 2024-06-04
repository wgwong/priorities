import { useFetcher } from "@remix-run/react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import {
  Input,
  Tabs,
  Tab,
  Button,
  Textarea,
  Selection,
  Chip,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { KeyboardEvent, useState } from "react";
import { Key } from "@react-types/shared";
import { useContext } from "react";
import {
  ActivityMinSessionType,
  MinOrHour,
  NewActivityArguments,
} from "./types";
import { getHoursAndMin } from "./utils";
import { Activity, ActivityContext } from "./ActivityContext";
import { CategoryContext } from "./CategoryContext";
import { ActionFunctionArgs, json } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  console.log("newactivity.tsx route action request: ", request);
  const formData = await request.formData();
  const id = formData.get("id");
  //await db.recipes.delete(id);
  return json({ ok: true });
}

export function NewActivity() {
  const fetcher = useFetcher({ key: "activities" });
  const activityContext = useContext(ActivityContext);
  const categoryContext = useContext(CategoryContext);
  const categoryEntries = Array.from(categoryContext.state);

  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [categoryNames, setCategoryNames] = useState<Set<string>>(new Set());
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [minSessionTime, setMinSessionTime] = useState<number>();
  const [minSessionTimeType, setMinSessionTimeType] =
    useState<ActivityMinSessionType>("minutes");

  function isFormFilled(): boolean {
    return name != null && minSessionTime != null && !isNaN(minSessionTime);
  }

  function addNewActivity() {
    console.log("DEBUG addNewActivity");
    if (!isFormFilled()) {
      throw Error("not all form values are filled");
    }

    const nonnullName: string = name!;
    const nonnullMinSessionTime: number = minSessionTime!;

    const newActivityArgs: NewActivityArguments = {
      name: nonnullName,
      description: description,
      minTimePerSession: getHoursAndMin(
        nonnullMinSessionTime,
        minSessionTimeType
      ),
      categoryKeys: [],
    };

    const jsonString = JSON.stringify(new Activity(newActivityArgs));

    console.log("calling fetcher.submit on jsonString: ", jsonString);
    fetcher.submit(jsonString, { action: "/NewActivity" });
    console.log("fetcher.formData: ", fetcher.formData);

    /*
    activityContext.dispatch({
      type: "add",
      activity: new Activity(newActivityArgs),
    });
    categoryContext.dispatch({
      type: "add",
      categoryNames,
    });
    */
  }

  function clearActivity() {
    setMinSessionTimeType("minutes");
  }

  const addCategory = (categoryName: string) => {
    const copiedSet = new Set(categoryNames);
    if (categoryName.length > 0) {
      copiedSet.add(categoryName);
      setCategoryNames(copiedSet);
      setCategoryInput("");
    }
  };

  const removeCategory = (name: string) => {
    categoryNames.delete(name);
    setCategoryNames(new Set(categoryNames));
  };

  return (
    <Card className="max-w-[400px]">
      <CardHeader>Enter a new activity</CardHeader>
      <Divider />
      <CardBody className="flex gap-4">
        <Input
          label="Name"
          placeholder="Enter a name"
          isRequired
          value={name}
          onValueChange={setName}
        />
        <Textarea
          label="Description"
          placeholder="Enter a description"
          value={description}
          onValueChange={setDescription}
        />
        <div className="flex gap-2 items-center max-w-[400px] overflow-x-auto">
          <span>Categories</span>
          {Array.from(categoryNames).map((name, index) => (
            <Chip
              key={index}
              onClose={() => removeCategory(name)}
              variant="flat"
            >
              {name}
            </Chip>
          ))}
        </div>
        <Autocomplete
          allowsCustomValue
          label="Add new or existing category(s)"
          variant="bordered"
          items={categoryEntries}
          inputValue={categoryInput}
          onKeyDown={(e: KeyboardEvent) => {
            // TODO see if theres a way to get default handler or ctrl+a
            if (e.key.length == 1) {
              // jank way to determine if printable letter
              setCategoryInput(categoryInput + e.key);
            } else if (e.key == "Enter") {
              addCategory(categoryInput);
              console.log("enter: ", e);
            } else if (e.key == "Backspace") {
              setCategoryInput(categoryInput.slice(0, -1));
            } else {
              // console.log("key: ", e);
            }
          }}
          onSelectionChange={(key) => {
            console.log("onSelectionChange key: ", key);
            if (key) {
              addCategory(key as string);
            }
          }}
        >
          {([_, category]) => (
            <AutocompleteItem key={category.name}>
              {category.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Minimum session time"
            type="number"
            value={String(minSessionTime)}
            onValueChange={(newVal: string) =>
              setMinSessionTime(parseInt(newVal))
            }
            inputMode="numeric"
          />
          <Tabs
            aria-label="MinSessionTimeType"
            selectedKey={minSessionTimeType}
            onSelectionChange={(key: Key) =>
              setMinSessionTimeType(key as ActivityMinSessionType)
            }
            size="lg"
            variant="light"
            radius="md"
          >
            {MinOrHour.map((value) => (
              <Tab className="text-sm" key={value} title={value} />
            ))}
          </Tabs>
        </div>
        <Button
          className="text-tiny"
          variant="flat"
          color="primary"
          radius="sm"
          size="sm"
          isDisabled={!isFormFilled()}
          onClick={() => {
            addNewActivity();
          }}
        >
          Add
        </Button>
      </CardBody>
    </Card>
  );
}
