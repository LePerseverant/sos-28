import { DatePicker, DatePickerProps } from "antd"
import "./CustomDatePicker.css"

const CustomDatePicker: React.FC<DatePickerProps> = ({ name }) => {
  const handleDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString)
  }
  return (
    <div className={`date-picker-container-${name}`}>
      <DatePicker
        name={name}
        onChange={handleDateChange}
        getPopupContainer={() =>
          document.querySelector(
            `.date-picker-container-${name}`
          ) as HTMLElement
        }
        superNextIcon={null}
        superPrevIcon={null}
        renderExtraFooter={() => null}
      />
    </div>
  )
}

export default CustomDatePicker
