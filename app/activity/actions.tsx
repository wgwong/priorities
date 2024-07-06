"use server";

import { queryRowToKeyedActivity, sleep } from "../utils";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { KeyedActivity } from "../types";

/*
  https://postgresapp.com/

  psql "postgres://default:************@ep-purple-cherry-a4gxtc1y.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require"

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

export const getActivities = async () => {
  noStore();
  const { rows } = await sql`SELECT * FROM activities;`;

  return queryRowToKeyedActivity(rows);
};

export async function addNewActivity(
  formData: FormData
): Promise<KeyedActivity | null> {
  /*
    if (!isFormFilled()) {
      throw Error("not all form values are filled");
    }
    */

  // do some validation here

  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const maybeMinutes = formData.get("minutes") ?? 0;
    const minutes =
      maybeMinutes && Number.isNaN(maybeMinutes) ? 0 : (maybeMinutes as number);
    const maybeHours = formData.get("hours") ?? 0;
    const hours =
      maybeHours && Number.isNaN(maybeHours) ? 0 : (maybeHours as number);

    console.log(
      "addNewActivity: name: ",
      name,
      ", description: ",
      description,
      ", minutes: ",
      minutes,
      ", hours: ",
      hours
    );

    const { rows } =
      await sql`INSERT INTO activities (name, description, minutes, hours) VALUES
        (${name}, ${description}, ${minutes}, ${hours})
        RETURNING id, name, description, minutes, hours;
        `;
    const row = rows[0];
    const activityRow: KeyedActivity = {
      key: row["id"],
      activity: {
        name: row["name"],
        description: row["description"],
        minutes: row["minutes"],
        hours: row["hours"],
      },
    };
    return activityRow;
  } catch (error) {
    console.error(error);
  }
  return null;
}

export async function deleteActivity(key: string): Promise<boolean> {
  try {
    const { rows } = await sql`DELETE FROM activities WHERE id = ${key}
        RETURNING id;
        `;
    console.log("deleteActivity deleted rows: ", rows);
    return rows.length > 0;
  } catch (error) {
    console.error(error);
  }
  return false;
}
