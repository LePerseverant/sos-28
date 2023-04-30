import React, { useContext, useState } from "react"
import { Modal, Form, Input, Row, Checkbox, Col, Button } from "antd"
import { SupplyEvent } from "./types"
import "./EditSupplyEventModal.css"
import { DeleteOutlined } from "@ant-design/icons"
import { DataSourceContext } from "./contexts"
import * as _ from "lodash"
import CustomDatePicker from "./CustomDatePicker"

interface AddSupplyEventModalProps {
  title : string
}

const AddSupplyEventModal: React.FC<AddSupplyEventModalProps> = ({
  title
}) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const { value, setValue } = useContext(DataSourceContext)

  const handleCreate = (
    values: SupplyEvent & { terminal: string; locationSelection: string }
  ): void => {
    console.log("Received values of form: ", values)
    const updatedDataSource = [...value]
    updatedDataSource.push({...values })
    setValue(updatedDataSource)
    setVisible(false)
  }

  const handleCancel = (): void => setVisible(false)

  const showModal = (): void => {
    form.setFieldsValue({})
    setVisible(true)
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
      <Button
        className="button"
        onClick={showModal}
        type="primary"
      >
        Add Event
      </Button>
      <Modal
        width={700}
        centered
        closable={false}
        open={visible}
        title={title}
        okText="Add Event"
        okButtonProps={{
          icon: <DeleteOutlined />,
        }}
        cancelText="Cancel"
        onCancel={handleCancel}
        onOk={handleOk}
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

export default AddSupplyEventModal
