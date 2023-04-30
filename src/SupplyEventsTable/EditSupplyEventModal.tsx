import React, { useContext, useState } from "react"
import { Modal, Form, Input, Row, Checkbox, Col } from "antd"
import { SupplyEvent } from "./types"
import "./EditSupplyEventModal.css"
import { DeleteOutlined } from "@ant-design/icons"
import { DataSourceContext } from "./contexts"
import * as _ from "lodash"
import CustomDatePicker from "./CustomDatePicker"

interface EditSupplyEventModalProps {
  record: SupplyEvent
}

const EditSupplyEventModal: React.FC<EditSupplyEventModalProps> = ({
  record,
}) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const { value, setValue } = useContext(DataSourceContext)

  const handleCreate = (
    values: SupplyEvent & { terminal: string; locationSelection: string }
  ): void => {
    console.log("Received values of form: ", values)
    const index = _.findIndex(value, record)
    const updatedDataSource = [...value]
    updatedDataSource.splice(index, 1, { ...record, ...values })
    setValue(updatedDataSource)
    setVisible(false)
  }

  const handleCancel = (): void => setVisible(false)

  const showModal = (): void => {
    form.setFieldsValue({ ...record, terminal: record.locationType })
    setVisible(true)
  }
  const handleEdit = () => {
    const index = _.findIndex(value, record)
    const updatedDataSource = [...value]
    updatedDataSource.splice(index, 1, { ...record, isDeleted: true })
    setValue(updatedDataSource)
    console.log(JSON.stringify(updatedDataSource))
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields()
        handleCreate(values)
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }

  return (
    <>
      <p>
        <a className="edit-delete" onClick={showModal}>
          Edit/Delete
        </a>
      </p>
      <Modal
        width={700}
        centered
        closable={false}
        open={visible}
        title="Edit Supply Event:"
        okText="Delete Event"
        okButtonProps={{
          icon: <DeleteOutlined />,
        }}
        cancelText="Submit"
        onCancel={handleOk}
        onOk={handleEdit}
      >
        <Form form={form}>
          <Row justify="start">
            <Form.Item name="terminal">
              <Input placeholder="Terminal" />
            </Form.Item>
            <Form.Item name="locationSelection">
              <Input placeholder="Location selection" disabled />
            </Form.Item>
          </Row>
          <Row justify="start">
            <Form.Item name="annualEvent">
              <Checkbox className="checkbox">Annual Event</Checkbox>
            </Form.Item>
            <Row className="date-pickers">
              <CustomDatePicker name="startDate" />
              <span className="to-span">to</span>
              <CustomDatePicker name="endDate" />
            </Row>
          </Row>
          <Col className="modal-inputs">
            <Form.Item name="category">
              <Input placeholder="Category" />
            </Form.Item>
            <Form.Item name="product">
              <Input placeholder="Product Impacted" />
            </Form.Item>
            <Form.Item name="positive">
              <Input placeholder="Positive" disabled />
            </Form.Item>
            <Form.Item name="impact">
              <Input placeholder="Impact" />
            </Form.Item>
          </Col>
          <Form.Item name="comment">
            <Input.TextArea placeholder="Comment" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditSupplyEventModal
