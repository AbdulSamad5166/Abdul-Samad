import Button from './Button.jsx'
import Header from './Header.jsx'
import './index.css'

function App() {
  return (
    <main className="app">
      <Header
        title="Welcome"
        description="A small React page with reusable components."
      />
      <div className="button-row">
        <Button onClick={() => alert('Hello!')}>Say hello</Button>
        <Button variant="secondary" onClick={() => alert('Thanks for visiting!')}>
          Learn more
        </Button>
      </div>
    </main>
  );
}

export default App;