"use client";

import ActivityTable from "./activitytable";
import NewActivity from "./newactivity";
import { ActivityProvider } from "../activitycontext";
import { KeyedActivity } from "../types";

export type ActivityWrapperProp = {
  keyedActivities: KeyedActivity[];
};

export function ActivityWrapper({ keyedActivities }: ActivityWrapperProp) {
  return (
    <ActivityProvider keyedActivities={keyedActivities}>
      <div className="flex gap-4">
        <NewActivity />
        <ActivityTable />
      </div>
    </ActivityProvider>
  );
}
