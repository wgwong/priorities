"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Tooltip,
} from "@nextui-org/react";
import { useContext } from "react";
import { Key } from "@react-types/shared";
import { DeleteIcon } from "../icons/deleteicon";
import { EditIcon } from "../icons/editicon";
import { getStringFromHoursAndMin } from "../utils";
import { Activity, NewActivityArguments, TableHeaderType } from "../types";
import { EyeIcon } from "../icons/eyeicon";
import { getActivities } from "./actions";
//import { EntryContext } from "./EntryContext";
//import { ActivityContext } from "./ActivityContext";

type ActivityTableRow = {
  key: string;
  name: string;
  description: string;
  minSessionTime: string;
};

function getTableHeaderFields(): TableHeaderType {
  return [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "description",
      label: "DESCRIPTION",
    },
    {
      key: "minSessionTime",
      label: "MINIMUM SESSION TIME",
    },
    {
      key: "action",
      label: "ACTIONS",
    },
  ];
}

export type ActivityTableProps = {
  activities: ActivityDataRow[];
};

export type ActivityDataRow = {
  key: string;
  name: string;
  description: string;
  minutes: number;
  hours: number;
};

// https://nextui.org/docs/components/table
export default function ActivityTable(props: ActivityTableProps) {
  const { activities } = props;

  //const activityContext = useContext(ActivityContext);
  //console.log("ActivityTable activities: ", activityContext.state);

  //const activities = await getActivities();
  /*
  const activities = data.map((row) => {
    const args: NewActivityArguments = {
      name: row.name,
      description: row.description,
      minTimePerSession: { hours: row.hours, minutes: row.minutes },
      categoryKeys: [],
    };

    return new Activity(args);
  });
  */
  console.log(" activities: ", activities);

  const columns = getTableHeaderFields();
  const rows: ActivityTableRow[] = activities.map((row) => {
    return {
      key: row.key,
      name: row.name,
      description: row.description ?? "",
      minSessionTime: getStringFromHoursAndMin({
        minutes: row.minutes,
        hours: row.hours,
      }),
    };
  });

  const deleteActivity = (key: string) => {
    console.log("deleting activity key: ", key);
    /*
    activityContext.dispatch({
      type: "del",
      key: key,
    });
    */
  };

  const renderCell = (row: ActivityTableRow, columnKey: Key) => {
    if (columnKey == "action") {
      return (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Actiity details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit activity">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete activity">
            <span
              className="text-lg text-danger cursor-pointer active:opacity-50"
              onClick={() => deleteActivity(row.key)}
            >
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      );
    } else {
      return getKeyValue(row, columnKey);
    }
  };
  return (
    <Card>
      <CardHeader>Activities</CardHeader>
      <Divider />
      <CardBody>
        <Table aria-label="Activities">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows} emptyContent={"No activities to display."}>
            {(row) => (
              <TableRow key={row.key}>
                {(columnKey) => (
                  <TableCell>{renderCell(row, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
