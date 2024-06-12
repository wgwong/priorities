"use server";

import { ActivityMinSessionType } from "../types";
import { getHoursAndMin, queryRowToDataRow, sleep } from "../utils";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { ActivityDataRow } from "./activitytable";

/*
  https://postgresapp.com/

  psql "postgres://default:uvtPYfTC73aL@ep-purple-cherry-a4gxtc1y.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require"

  CREATE TABLE IF NOT EXISTS activities (
    id int GENERATED ALWAYS AS IDENTITY,
    name varchar,
    description varchar,
    minutes int,
    hours int
  );
*/

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

  let activity: ActivityDataRow[] = [];

  try {
    const name = formData.get("name");
    const description = formData.get("description");
    const minTimePerSession = getHoursAndMin(
      formData.get("minsessiontime"),
      minSessionTimeType
    );

    console.log(
      "addNewActivity: name: ",
      name,
      ", description: ",
      description,
      ", minTimePerSession: ",
      minTimePerSession
    );

    await sql`INSERT INTO activities (name, description, minutes, hours) VALUES (${name}, ${description}, ${minTimePerSession.minutes}, ${minTimePerSession.hours});`;
  } catch (error) {
    console.error(error);
    //NextResponse.json({ status: 500 });
  }
  console.log("addNewActivity finished");
  //return NextResponse.json({ status: 200 });
}

export const getActivities = async () => {
  noStore();
  const { rows } = await sql`SELECT * FROM activities;`;

  console.log("getActivities rows: ", rows);

  return rows;
};
export { queryRowToDataRow };
