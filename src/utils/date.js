const date = new Date();

export function todayWithTime() {
  return `${date.getFullYear()}-${date.getMonth() < 10 ? "0" + date.getMonth(): date.getMonth()}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}T${date.getHours()}:${date.getMinutes()}`
}