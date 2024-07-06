// https://thoughtbot.com/blog/the-trouble-with-typescript-enums
// https://camchenry.com/blog/typescript-union-type
// https://jaketrent.com/post/loop-typescript-union-type/
// https://thoughtbot.com/blog/the-case-for-discriminated-union-types-with-typescript

export const GoalPriority = ["Low", "Med", "High"] as const;
export type GoalPriorityType = (typeof GoalPriority)[number];

export const DayOfWeek = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;
export type DayOfWeekType = (typeof DayOfWeek)[number];
export type Weekend = Extract<DayOfWeekType, "sat" | "sun">;
export type Weekday = Exclude<DayOfWeekType, Weekend>;

export const GoalFrequency = ["day", "week", "month"] as const;
export type GoalFrequencyType = (typeof GoalFrequency)[number];

export type HoursAndMin = {
  hours: number;
  minutes: number;
};

export const MinOrHour = ["minutes", "hours"] as const;
export type MinOrHourType = (typeof MinOrHour)[number];

export const Times = ["times"] as const;
export type TimesType = (typeof Times)[number];

export type GoalDesiredType = TimesType | MinOrHourType;

export type ActivityMinSessionType = MinOrHourType;

export type TimeOrCount =
  | { __type: "time"; time: HoursAndMin }
  | { __type: "count"; count: number };

export type DesiredTimeOrCount = {
  timeOrCount: TimeOrCount;
  frequency: GoalFrequencyType;
};

export const MINUTES_IN_AN_HOUR = 60;

export type NewCategoryArguments = {
  name: string;
  description?: string;
};

export type NewEntryArgs = {
  activityKey: string;
  date: Date;
  sessionTime: HoursAndMin;
};

export type NewActivityArguments = {
  name: string;
  description?: string;
  minMinutes: number;
  minHours: number;
  categoryKeys: string[];
};

/*
if name/category = null, then treat as * (any name/category passes)
if name & category both specified, entry has to match both to pass
can get specific about a particular activity (see below on photography)
can have 2 separate goals to define two aspects of an activity

- play badminton 4 times a month
name=badminton, category?= null, cadence=4 times a month
- exercise 60 min a week
name? = null, category=[fitness], cadence = 1 hr a week
- practice photography 2 times a month
name=photography, category=[practice, outside], cadence = 2 times a month
- learn photography concepts 1 time a week
  name=photography, category=[learning], cadence = 1 time a week
- be outdoors 5 times a week
  name? = null, category = [outside], cadence = 5 times a week

  must have at least name OR category
*/
export type GoalRequirement = {
  activityKeys: string[];
  categoryKeys: string[];
  occurrence: DesiredTimeOrCount;
};

export type NewGoalConfigArguments = {
  name: string;
  description?: string;
  priority: GoalPriorityType;
  requirement: GoalRequirement;
  excludedDays: DayOfWeekType[];
  tags: []; // todo
};

// nextUI Table
export type TableHeaderType = {
  key: string;
  label: string;
}[];

export type Activity = {
  name: string;
  description?: string;
  minutes: number;
  hours: number;
};

export type KeyedActivity = {
  key: string;
  activity: Activity;
};
