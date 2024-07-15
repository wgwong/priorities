// https://github.com/vercel/next.js/issues/65673

"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Textarea,
} from "@nextui-org/react";
import { useFormStatus } from "react-dom";
import { addNewActivity } from "./actions";
import { useContext, useState } from "react";
import { ActivityContext } from "../activitycontext";
import { CategorySelector } from "../category/categoryselector";
import { CategorySelectorTag } from "../types";
//import { CategoryContext } from "../categorycontext";

export default function NewActivity() {
  const activityContext = useContext(ActivityContext);
  //const categoryContext = useContext(CategoryContext);

  const [tags, setTags] = useState<CategorySelectorTag[]>([]);

  function FormComponents() {
    const formStatus = useFormStatus(); // this needs to be called within a parent form

    /*
    unavailable until nextjs v.14.3
    const [formResponse, formAction, isPending] = useActionState(
      addNewActivityWithParams,
      null
    );
    */
    return (
      <>
        <Input
          label="Name"
          name="name"
          placeholder="Enter a name"
          isRequired
          disabled={formStatus.pending}
        />
        <Textarea
          label="Description"
          name="description"
          placeholder="Enter a description"
          disabled={formStatus.pending}
        />
        <div className="flex gap-4 items-center">
          <Input
            name="minutes"
            label="Minimum minute(s)"
            type="number"
            inputMode="numeric"
            disabled={formStatus.pending}
          />
          <Input
            name="hours"
            label="Minimum hour(s)"
            type="number"
            inputMode="numeric"
            disabled={formStatus.pending}
          />
        </div>
        <CategorySelector tags={tags} setTags={setTags} />
        <Button
          type="submit"
          className="text-tiny"
          variant="flat"
          color="primary"
          radius="sm"
          size="sm"
          disabled={formStatus.pending}
        >
          {formStatus.pending ? "Adding..." : "Add"}
        </Button>
      </>
    );
  }

  async function addNewActivityHandler(formData: FormData) {
    console.log("addNewActivityHandler called formData: ", formData);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    let minutes = 0,
      hours = 0;
    const maybeMinutes = formData.get("minutes") ?? 0;
    const maybeHours = formData.get("hours") ?? 0;

    if (
      !(maybeMinutes instanceof File) &&
      maybeMinutes !== "" &&
      !Number.isNaN(maybeMinutes)
    ) {
      minutes = maybeMinutes as number;
    }
    if (
      !(maybeHours instanceof File) &&
      maybeHours !== "" &&
      !Number.isNaN(maybeHours)
    ) {
      hours = maybeHours as number;
    }

    console.log(
      "addNewActivityHandler tags: ",
      JSON.stringify(tags),
      ", length: ",
      tags.length
    );

    const keyedActivity = await addNewActivity({
      name,
      description,
      minutes,
      hours,
      tags,
    });

    if (keyedActivity) {
      console.log(
        "addNewActivityHandler calling reducer with keyedActivity: ",
        keyedActivity
      );

      activityContext.dispatch({
        type: "upsert",
        keyedActivity,
      });
    }
  }

  return (
    <Card className="max-w-[400px]">
      <CardHeader>Enter a new activity</CardHeader>
      <Divider />
      <CardBody>
        <form action={addNewActivityHandler} className="flex flex-col gap-4">
          <FormComponents />
        </form>
      </CardBody>
    </Card>
  );
}
