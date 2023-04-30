import React, { useContext, useEffect, useRef, useState } from "react"
import { InputRef, Space } from "antd"
import { Button, Form, Input, Table } from "antd"
import type { FormInstance } from "antd/es/form"
import { SupplyEvent } from "./types"
import columns from "./Columns"
import { DataSourceContext } from "./contexts"
import "./EditableTable.css"
import AddSupplyEventModal from "./AddSupplyEventModal"

const EditableContext = React.createContext<FormInstance<any> | null>(null)

/*
 * EDITABLE ROW COMPONENT
 */
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

/*
 * EDITABLE CELL COMPONENT
 */
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

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>
/*
 * EDITABLE TABLE COMPONENT
 */
type EditableTableProps = Parameters<typeof Table>[0]

const EditableTable: React.FC = () => {
  const { value, setValue } = useContext(DataSourceContext)
  const [showDeletedEvents, setShowDeletedEvents] = useState(false)
  const dataSource = value.filter((record) => !record.isDeleted)
  const deletedSupplyEvents = value.filter((record) => record.isDeleted)
  const handleShowDeletedSupplyEvents = () =>
    setShowDeletedEvents((prevState) => !prevState)

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

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
        <Space.Compact className="twin-buttons">
          <Button
            className="twin-buttons"
            onClick={() => alert("not implemented!")}
            type="primary"
          >
            Current Year Events
          </Button>
          <Button
            className="twin-buttons"
            onClick={() => alert("not implemented!")}
            type="primary"
          >
            Prior Year Events
          </Button>
        </Space.Compact>
      </div>
      <AddSupplyEventModal title="Add Supply Event:" />
    </div>
  )

  return (
    <div>
      <Heading month="March" />
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        pagination={false}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        footer={() => (
          <span className="link" onClick={handleShowDeletedSupplyEvents}>
            {showDeletedEvents
              ? "Hide all deleted events"
              : "See all deleted events"}
          </span>
        )}
      />
      {showDeletedEvents && (
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          pagination={false}
          bordered
          dataSource={deletedSupplyEvents}
          columns={columns as ColumnTypes}
        />
      )}
    </div>
  )
}

export default EditableTable
