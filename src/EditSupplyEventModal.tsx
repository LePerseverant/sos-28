import React, { useState } from "react"
import { Modal, Form, Input, Row, Checkbox } from "antd"
import { SupplyEvent } from "./EditableTable"

interface EditSupplyEventModalProps {
  record: SupplyEvent
}

const EditSupplyEventModal: React.FC<EditSupplyEventModalProps> = ({
  record,
}) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)

  const handleCreate = (values: SupplyEvent & { terminal: string, locationSelection: string }): void => {
    console.log("Received values of form: ", values)
    setVisible(false)
  }

  const handleCancel = (): void => {
    setVisible(false)
  }
  const showModal = (): void => {
    alert(JSON.stringify(record))
    form.setFieldsValue({ ...record, terminal: record.locationType })
    setVisible(true)
  }
  /*
   * MODAL FOOTER
   */
  // const Footer = (
  //   <div>
  //     <Button onClick={() => alert("not implemented")}>Cancel</Button>
  //     <Button>Delete Event</Button>
  //     <Button onClick={() => alert("not implemented")}>Submit</Button>
  //   </div>
  // )

  return (
    <>
    <p>
              <a className="edit-delete" onClick={showModal}>
                Edit/Delete {record.key}
              </a>
            </p>
      <Modal
        open={visible}
        title="Create a new collection"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields()
              handleCreate(values)
            })
            .catch((info) => {
              console.log("Validate Failed:", info)
            })
        }}
      >
        <Form form={form}>
          <Row justify="space-between">
            <Form.Item name="terminal">
              <Input placeholder="Terminal" />
            </Form.Item>
            <Form.Item name="locationSelection">
              <Input placeholder="Location selection" />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item name="startDate">
              <Input placeholder="Start Date" />
            </Form.Item>
            <span>to</span>
            <Form.Item name="endDate">
              <Input placeholder="End Date" />
            </Form.Item>
            <Form.Item
              name="annualEvent"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Annual Event</Checkbox>
            </Form.Item>
          </Row>
          <Form.Item name="category">
            <Input placeholder="Category" />
          </Form.Item>
          <Form.Item name="product">
            <Input placeholder="Product Impacted" />
          </Form.Item>
          <Form.Item name="positive">
            <Input placeholder="Positive" />
          </Form.Item>
          <Form.Item name="impact">
            <Input placeholder="Impact" />
          </Form.Item>
          <Form.Item name="comment">
            <Input.TextArea placeholder="Comment" />
          </Form.Item>
          <Form.Item>
            <Input.TextArea
              placeholder="Comment"
              value={JSON.stringify(record)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditSupplyEventModal
