import Checkbox from "./components/Checkbox";
import Select from "./components/Select";

const containerStyles = {
  padding: "2rem",
};

function App() {
  return (
    <div style={containerStyles}>
      <Checkbox checked />
      <Select
        value={{ label: "pippo", value: "pippo" }}
        options={[
          { label: "pippo", value: "pippo" },
          { label: "paperino", value: "paperino" },
          { label: "topolino", value: "topolino" },
        ]}
      />
    </div>
  );
}

export default App;
