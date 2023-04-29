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
        picker="date"
        onChange={handleDateChange}
        getPopupContainer={() =>
          document.querySelector(
            `.date-picker-container-${name}`
          ) as HTMLElement
        }
        popupStyle={{
          transform: "scale(.7)",
          transition: "ease-in",
          left: name === "startDate" ? 160.301 : 321.301,
          top: 126.143,
        }}
        superNextIcon={null}
        superPrevIcon={null}
        renderExtraFooter={() => null}
      />
    </div>
  )
}

export default CustomDatePicker
