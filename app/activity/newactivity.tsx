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
import { useContext } from "react";
import { ActivityContext } from "../activitycontext";
import { CategorySelector } from "./categoryselector";

export default function NewActivity() {
  const activityContext = useContext(ActivityContext);

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
        <CategorySelector />
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
    const keyedActivity = await addNewActivity(formData);

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
