"use server";

import { ActivityMinSessionType, NewActivityArguments } from "../types";
import { getHoursAndMin, sleep } from "../utils";

/*
  function isFormFilled(): boolean {
    return name != null && minSessionTime != null && !isNaN(minSessionTime);
  }*/

export async function addNewActivity(
  minSessionTimeType: ActivityMinSessionType,
  formData: any
) {
  /*
    if (!isFormFilled()) {
      throw Error("not all form values are filled");
    }
    */

  // do some validation here
  const newActivityArgs: NewActivityArguments = {
    name: formData.get("name"),
    description: formData.get("description"),
    minTimePerSession: getHoursAndMin(
      formData.get("minsessiontime"),
      minSessionTimeType
    ),
    categoryKeys: [],
  };

  console.log("newActivityArgs: ", newActivityArgs);
}
