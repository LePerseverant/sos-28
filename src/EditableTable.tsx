import React, { useContext, useEffect, useRef, useState } from "react"
import { InputRef, Space } from "antd"
import { Button, Form, Input, Table } from "antd"
import type { FormInstance } from "antd/es/form"
import { SupplyEvent } from "./types"
import columns from "./Columns"
import { DataSourceContext, DataSourceContextProvider } from "./contexts"
import "./EditableTable.css"

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
  console.log('data table', value.length)
  

  // const handleDelete = (key: React.Key) => {
  //   const newData = dataSource.filter((item) => item.key !== key)
  //   setDataSource(newData)
  // }

  // const handleAdd = () => {
  //   const newData: SupplyEvent = {
  //     key: "1",
  //     locationType: "Terminal",
  //     applicability: "Flint Buckeye",
  //     product: "All",
  //     startDate: "3/5/2023",
  //     endDate: "3/8/2023",
  //     duration: "3",
  //     impact: "Medium",
  //     category: "Weather",
  //     comment: "Winter storm, extremly low demand",
  //   }
  //   setDataSource([...dataSource, newData])
  //   setCount(count + 1)
  // }

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
      <Button
        className="button"
        onClick={() => alert("not implemented!")}
        type="primary"
      >
        Add Event
      </Button>
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
          dataSource={value}
          columns={columns as ColumnTypes}
          footer={() => (
            <span className="link" onClick={() => alert("not implemented!")}>
              See all deleted events
            </span>
          )}
        />
      
    </div>
  )
}

export default EditableTable
