import useFileReader from "./hooks/useFileReader";
import ImageInput from "./components/ImageInput";

const containerStyles = {
  display: "grid",
  placeItems: "center",
  height: "100vh",
  padding: "2rem",
};

function App() {
  return (
    <div style={containerStyles}>
      <ImageInput label="Seleziona un'immagine cliccando il pulsante qui sotto o trascinandone una nell'area tratteggiata" />
    </div>
  );
}

export default App;
