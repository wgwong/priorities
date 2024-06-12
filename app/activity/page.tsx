import { getActivities, queryRowToDataRow } from "./actions";
import ActivityTable from "./activitytable";
import NewActivity from "./newactivity";

export default async function ActivityPage() {
  console.log("activity page");

  const data = await getActivities();

  const activities = queryRowToDataRow(data);

  console.log("page data: ", activities);

  return (
    <>
      <NewActivity />
      <ActivityTable activities={activities} />
    </>
  );
}
