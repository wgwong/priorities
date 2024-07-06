import { getActivities } from "./actions";
import { ActivityWrapper } from "./activitywrapper";

export default async function ActivityPage() {
  const keyedActivities = await getActivities();

  return <ActivityWrapper keyedActivities={keyedActivities} />;
}
