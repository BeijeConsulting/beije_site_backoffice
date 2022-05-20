import MarkdownEditor from "./components/MarkdownEditor";

const containerStyles = {
  padding: "2rem",
};

function App() {
  return (
    <div style={containerStyles}>
      <MarkdownEditor value="Ciao sono una **stringa**" />
    </div>
  );
}

export default App;
