// function App() {
//   return (
//     <div>
//       <h1>Hello React!</h1>
//     </div>
//   );
// }

// export default App;
import Header from "./components/Header";
import Card from "./components/Card";
import Button from "./components/Button";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div>
      <Header />

      <main className="container">
        <h2>Components</h2>

        <div className="card-list">
          <Card name="Ali Khan" role="Frontend Developer" city="Islamabad" />
          <Card name="Sara Ahmed" role="UI Designer" city="Lahore" />
          <Card name="Usman Raza" role="Student" city="Karachi" />
        </div>

        <div className="btn-row">
          <Button text="Save" color="green" />
          <Button text="Delete" color="crimson" />
          <Button text="Cancel" color="gray" />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;