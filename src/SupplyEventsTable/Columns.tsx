import { ColumnType } from "antd/es/table"
import { ReactComponent as RedArrow } from "../assets/red-arrow-down.svg"
import { ReactComponent as YellowArrow } from "../assets/yellow-arrow-down.svg"
import EditSupplyEventModal from "./EditSupplyEventModal"
import { SupplyEvent } from "./types"

const defaultColumns: (ColumnType<SupplyEvent> & { editable?: boolean })[] = [
  {
    title: "Location type",
    dataIndex: "locationType",
    sorter: (record_a: SupplyEvent, record_b: SupplyEvent) =>
      parseInt(record_a.key) - parseInt(record_b.key),
  },
  {
    title: "Applicability",
    dataIndex: "applicability",
    sorter: (record_a: SupplyEvent, record_b: SupplyEvent) =>
      parseInt(record_a.key) - parseInt(record_b.key),
  },
  {
    title: "PRODUCT",
    dataIndex: "product",
    sorter: (record_a: SupplyEvent, record_b: SupplyEvent) =>
      parseInt(record_a.key) - parseInt(record_b.key),
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    sorter: (record_a: SupplyEvent, record_b: SupplyEvent) =>
      parseInt(record_a.key) - parseInt(record_b.key),
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    sorter: (record_a: SupplyEvent, record_b: SupplyEvent) =>
      parseInt(record_a.key) - parseInt(record_b.key),
  },
  {
    title: "DURATION (Days)",
    dataIndex: "duration",
    sorter: (record_a: SupplyEvent, record_b: SupplyEvent) =>
      parseInt(record_a.key) - parseInt(record_b.key),
    render: (_, record: SupplyEvent) => `${record.duration}`,
  },
  {
    title: "IMPACT",
    dataIndex: "impact",
    sorter: (record_a: SupplyEvent, record_b: SupplyEvent) =>
      parseInt(record_a.key) - parseInt(record_b.key),
    render: (_, record: SupplyEvent) => (
      <div className="flex space-between">
        <p>{record.impact} </p>
        {record.impact === "High" && <RedArrow width="32" height="32" />}
        {record.impact === "Medium" && <YellowArrow width="32" height="32" />}
      </div>
    ),
  },
  {
    title: "CATEGORY",
    dataIndex: "category",
    sorter: (record_a: SupplyEvent, record_b: SupplyEvent) =>
      parseInt(record_a.key) - parseInt(record_b.key),
  },
  {
    title: "COMMENTS",
    dataIndex: "comment",
    render: (_, record: SupplyEvent) => {
      return (
        <div className="flex space-between">
          <p>{record.comment}</p>

          <EditSupplyEventModal record={record} />
        </div>
      )
    },
  },
]

const handleSave = (
  row: SupplyEvent,
  dataSource: SupplyEvent[],
  setDataSource: (data: SupplyEvent[]) => void
) => {
  const newData = [...dataSource]
  const index = newData.findIndex((item) => row.key === item.key)
  const item = newData[index]
  newData.splice(index, 1, {
    ...item,
    ...row,
  })
  setDataSource(newData)
}

const columns = defaultColumns.map((col) => {
  if (!col.editable) {
    return col
  }
  /*
   * IF COLUMN IS EDITABLE
   */
  return {
    ...col,
    onCell: (record: SupplyEvent) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
    }),
  }
})
export default columns
