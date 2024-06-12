"use client";

// https://github.com/vercel/next.js/issues/65673

import { Key, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Tab,
  Tabs,
  Textarea,
} from "@nextui-org/react";
import { ActivityMinSessionType, MinOrHour } from "./../types";
import { addNewActivity } from "./actions";
import { useFormStatus } from "react-dom";

export default function NewActivity() {
  const [minSessionTimeType, setMinSessionTimeType] =
    useState<ActivityMinSessionType>("minutes");

  const addNewActivityWithParams = addNewActivity.bind(
    null,
    minSessionTimeType
  );

  const isPending = useFormStatus();
  /*
  unavailable until nextjs v.14.3
  const [formResponse, formAction, isPending] = useActionState(
    addNewActivityWithParams,
    null
  );
  */

  return (
    <Card className="max-w-[400px]">
      <CardHeader>Enter a new activity</CardHeader>
      <Divider />
      <CardBody>
        <form action={addNewActivityWithParams} className="flex flex-col gap-4">
          <Input
            name="name"
            placeholder="Enter a name"
            isRequired
            disabled={isPending.pending}
          />
          <Textarea
            name="description"
            placeholder="Enter a description"
            disabled={isPending.pending}
          />
          <div className="flex gap-4 items-center">
            <Input
              name="minsessiontime"
              placeholder="Minimum session time"
              type="number"
              inputMode="numeric"
              disabled={isPending.pending}
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
            type="submit"
            className="text-tiny"
            variant="flat"
            color="primary"
            radius="sm"
            size="sm"
            disabled={isPending.pending}
          >
            {isPending.pending ? "Adding..." : "Add"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
