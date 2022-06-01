import { useState } from "react";
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  isSameDay,
  add,
  getDay,
} from "date-fns";
import { endOfMonth, parse } from "date-fns/esm";
import locale from "date-fns/locale/it";
import styles from "./styles.module.css";

const weekDays = [
  <span key="lu">Lu</span>,
  <span key="ma">Ma</span>,
  <span key="me">Me</span>,
  <span key="gi">Gi</span>,
  <span key="ve">Ve</span>,
  <span key="sa">Sa</span>,
  <span key="do">Do</span>,
];

const DatePicker = ({ value, onChange, placeholder }) => {
  const [month, setMonth] = useState(format(value || new Date(), "MMMM-yyyy"));
  const firstdayofmonth = parse(month, "MMMM-yyyy", new Date());
  const days = eachDayOfInterval({
    start: startOfMonth(firstdayofmonth),
    end: endOfMonth(firstdayofmonth),
  });

  function nextMonth(toAdd) {
    const firstdayofnextmonth = add(firstdayofmonth, { months: toAdd });
    setMonth(format(firstdayofnextmonth, "MMMM-yyyy"));
  }

  return (
    <div className={styles["container"]}>
      <button type="button" className={styles["picker"]}>
        {value ? format(value, "dd MMM yyyy", { locale }) : ""}
        <span
          className={`${styles["placeholder"]} ${value ? styles["up"] : ""}`}
        >
          {placeholder}
        </span>
      </button>
      <div className={styles["calendar"]}>
        <header className={styles["header"]}>
          <h3>{format(firstdayofmonth, "MMMM yyyy", { locale })}</h3>
          <div className={styles["header-btns"]}>
            <button
              type="button"
              onClick={() => {
                nextMonth(-1);
              }}
            ></button>
            <button
              type="button"
              onClick={() => {
                nextMonth(1);
              }}
            ></button>
          </div>
        </header>
        <div className={styles["weekdays"]}>{weekDays}</div>
        <div className={styles["days-container"]}>
          {days.map((day, i) => (
            <button
              type="button"
              key={format(day, "dd MMM yyyy")}
              style={{
                gridColumnStart: i === 0 ? colStart[getDay(day)] : "auto",
              }}
              className={isSameDay(value, day) ? styles["selected"] : ""}
              onClick={() => {
                onChange(day);
              }}
            >
              {format(day, "d")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

let colStart = [7, 1, 2, 3, 4, 5, 6];

export default DatePicker;
