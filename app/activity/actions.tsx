"use server";

import { queryRowToKeyedActivity, sleep } from "../utils";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { CategorySelectorTag, KeyedActivity } from "../types";

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

  CREATE TABLE IF NOT EXISTS categories (
    id int GENERATED ALWAYS AS IDENTITY,
    name varchar UNIQUE,
    description varchar,
    activityIds varchar[]
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

type AddNewActivityArgs = {
  name: string;
  description?: string;
  minutes: number;
  hours: number;
  tags: CategorySelectorTag[];
};

async function addNewCategories(
  activityId: string,
  tags: CategorySelectorTag[]
) {
  console.log("addNewCategories: ", tags);
  // vercel doesn't support pre-templated bulk inserts without some nasty workarounds,
  // so we will insert 1-by-1
  try {
    tags.forEach(async (tag) => {
      console.log("tag: ", tag);
      const { rows } = await sql`INSERT into categories as c (name, activityIds)
    VALUES (${tag.name}, ARRAY[${activityId}])
    ON CONFLICT (name)
    DO UPDATE SET
    activityIds = EXCLUDED.activityIds || c.activityIds
    RETURNING id, name, activityIds`;
      console.log("categoryRows: ", rows);
    });
  } catch (error) {
    console.error(error);
  }
}

export async function addNewActivity({
  name,
  description,
  minutes,
  hours,
  tags,
}: AddNewActivityArgs): //formData: FormData
Promise<KeyedActivity | null> {
  /*
    if (!isFormFilled()) {
      throw Error("not all form values are filled");
    }
    */

  // TODO do some validation here

  try {
    console.log(
      "addNewActivity: name: ",
      name,
      ", description: ",
      description,
      ", minutes: ",
      minutes,
      ", hours: ",
      hours,
      ", tags:",
      JSON.stringify(tags),
      ", tag length: ",
      tags.length
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

    await addNewCategories(activityRow.key, tags);

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
