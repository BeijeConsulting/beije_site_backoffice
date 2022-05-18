import useFileReader from "./hooks/useFileReader";
import Select from "./components/Select";

const containerStyles = {
  display: "grid",
  placeItems: "center",
  height: "100vh",
  padding: "2rem",
};

function App() {
  return (
    <div style={containerStyles}>
      <Select />
    </div>
  );
}

export default App;
