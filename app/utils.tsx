import { DayOfWeek, DayOfWeekType, HoursAndMin, MinOrHourType } from "./types";
import { Selection } from "@nextui-org/react";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getFilteredDayOfTheWeek = (
  daysToFilter: DayOfWeekType[]
): DayOfWeekType[] => {
  const filteredDays: DayOfWeekType[] = DayOfWeek.filter(
    (day: string) => !daysToFilter.includes(day as DayOfWeekType)
  );

  return filteredDays;
};

export const getEnumValue = (enumKey: any): any => {};

export const getHoursAndMin = (
  time: number,
  type: MinOrHourType
): HoursAndMin => {
  if (type == "minutes") {
    return { hours: 0, minutes: time };
  } else {
    // type == "hours"
    return { hours: time, minutes: 0 };
  }
};

export const getStringFromHoursAndMin = (hoursAndMin: HoursAndMin): string => {
  let stringForm = "";
  if (hoursAndMin.hours > 0) {
    stringForm += hoursAndMin.hours + " hours";
  }
  if (hoursAndMin.minutes > 0) {
    if (stringForm != "") {
      stringForm += " and ";
    }
    stringForm += hoursAndMin.minutes + " minutes";
  }

  return stringForm;
};

// https://joeattardi.dev/customizing-jsonparse-and-jsonstringify
export function activityConfigJSONReplacer(key: string, value: any): any {
  // TODO may not need

  return value;
}

export function isSelectionEmpty(selection: Selection | undefined) {
  return selection == null || selection == "all" || selection.size == 0;
}
