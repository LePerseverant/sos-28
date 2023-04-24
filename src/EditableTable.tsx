import React, { useContext, useEffect, useRef, useState } from "react"
import type { InputRef } from "antd"
import { Button, Form, Input, Table } from "antd"
import type { FormInstance } from "antd/es/form"
import "./EditableTable.css"
import { dummyDataSource } from "./dummy-data"
import { ColumnType } from "antd/es/table"
import { ReactComponent as RedArrow } from "./assets/red-arrow-down.svg"
import { ReactComponent as YellowArrow } from "./assets/yellow-arrow-down.svg"
import EditSupplyEventModal from "./EditSupplyEventModal"

const EditableContext = React.createContext<FormInstance<any> | null>(null)

type Impact = "Low" | "Medium" | "High"
type Category = "Weather" | "Terminal Disruption" | "Arb"

export interface SupplyEvent {
  key: string
  locationType: string
  applicability: string
  product: string
  startDate: Date | string
  endDate: Date | string
  duration: number | string
  impact: Impact
  category: Category
  comment: string
}

interface EditableRowProps {
  index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof SupplyEvent
  record: SupplyEvent
  handleSave: (record: SupplyEvent) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()

      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log("Save failed:", errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

type EditableTableProps = Parameters<typeof Table>[0]

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>

const EditableTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<SupplyEvent[]>(dummyDataSource)
  const [count, setCount] = useState(2)
 

  // const handleDelete = (key: React.Key) => {
  //   const newData = dataSource.filter((item) => item.key !== key)
  //   setDataSource(newData)
  // }

  const defaultColumns: (ColumnType<SupplyEvent> & { editable?: boolean })[] = [
    {
      title: "Location type",
      dataIndex: "locationType",
      editable: false,
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
          {record.impact === "High" && <RedArrow width="64" height="64" />}
          {record.impact === "Medium" && <YellowArrow width="64" height="64" />}
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

  const handleAdd = () => {
    const newData: SupplyEvent = {
      key: "1",
      locationType: "Terminal",
      applicability: "Flint Buckeye",
      product: "All",
      startDate: "3/5/2023",
      endDate: "3/8/2023",
      duration: "3",
      impact: "Medium",
      category: "Weather",
      comment: "Winter storm, extremly low demand",
    }
    setDataSource([...dataSource, newData])
    setCount(count + 1)
  }

  const handleSave = (row: SupplyEvent) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setDataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
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

  /*
   * TABLE HEADING
   */
  interface HeadingProps {
    month?: string
  }
  const Heading: React.FC<HeadingProps> = ({ month }) => (
    <div className="heading flex space-between">
      <div>
        <h1>Supply Events ({month}):</h1>
        <p>
          <Button className="button" onClick={handleAdd} type="primary">
            Add a row
          </Button>
          <Button className="button" onClick={handleAdd} type="primary">
            Add a row
          </Button>
        </p>
      </div>
      <Button className="button" onClick={handleAdd} type="primary">
        Add a row
      </Button>
    </div>
  )

  return (
    <div>
      <Heading month="March" />
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  )
}

export default EditableTable
