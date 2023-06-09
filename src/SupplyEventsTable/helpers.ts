export const stringDateToMillis = (dateString: string) => {
  const [day , month, year] = dateString.split("/")
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return date.getTime()
}
