const styles = (x, y) => ({
  position: "absolute",
  display: "flex",
  width: "350px",
  paddingInline: "2rem",
  paddingBlock: "1rem",
  background: "white",
  border: "1px solid var(--red)",
  top: `${y}px`,
  left: `${x}px`,
  transform: "translate(-50%, 10px)",
  flexDirection: "column",
  gap: "0.5rem",
  borderRadius: "var(--border-radius)",
});

const inputStyles = {
  display: "block",
  width: "100%",
  height: "32px",
  paddingInline: "8px",
  paddingBlock: "0.5rem",
  border: "1px solid var(--grey)",
  borderRadius: "var(--border-radius)",
  outline: "none",
};

const btnContainerStyles = {
  display: "flex",
  justifyContent: "center",
  gap: "0.5rem",
};

const btnStyles = (primary) => ({
  width: "150px",
  paddingBlock: "0.5rem",
  paddingInline: "0.2rem",
  backgroundColor: primary ? "var(--red)" : "#eee",
  color: primary ? "var(--white)" : "var(--black)",
  cursor: "pointer",
  textAlign: "center",
  border: "none",
  borderRadius: "var(--border-radius)",
});

export default function editorLinkPopup(xPos, yPos) {
  return new Promise((resolve, reject) => {
    const popup = document.createElement("div");
    Object.entries(styles(xPos, yPos)).forEach(([key, val]) => {
      popup.style[key] = val;
    });
    const input = document.createElement("input");
    Object.entries(inputStyles).forEach(([key, val]) => {
      input.style[key] = val;
    });
    input.placeholder = "https://www.google.com";
    const btnContainer = document.createElement("div");
    Object.entries(btnContainerStyles).forEach(([key, val]) => {
      btnContainer.style[key] = val;
    });

    const okBtn = document.createElement("button");
    okBtn.textContent = "ok";
    okBtn.addEventListener("click", () => {
      resolve(input.value);
      popup.remove();
    });
    Object.entries(btnStyles(true)).forEach(([key, val]) => {
      okBtn.style[key] = val;
    });
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "annulla";
    Object.entries(btnStyles(false)).forEach(([key, val]) => {
      cancelBtn.style[key] = val;
    });
    cancelBtn.addEventListener("click", () => {
      reject();
      popup.remove();
    });
    btnContainer.append(okBtn, cancelBtn);
    popup.append(input, btnContainer);
    document.body.append(popup);
  });
}
