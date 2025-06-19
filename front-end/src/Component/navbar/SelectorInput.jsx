import { useState } from "react";
import styles from "./navbar.module.css";

export default function SelectorInput({
  selectorArray,
  headerText,
  data,
  setData,
  defaultText,
  width,
}) {
  return (
    <div className={styles.selector_input_container}>
      <h3 className={styles.header_text}>{headerText}</h3>
      <select
        className={`${styles.selector}`}
        value={data}
        disabled={selectorArray.length == 0}
        onChange={(e) => setData(e.target.value)}
        style={{ width: width }}>
        <option value={0}>{defaultText}</option>
        {selectorArray.map((data) => (
          <option key={data.key} value={data.key}>
            {data.text_display}
          </option>
        ))}
      </select>
    </div>
  );
}
