// import Navbar from './components/_partials/Navbar'
// import Footer from './components/_partials/Footer'
// import Navegation from './components/routes/Navegation'
import Navigation from "./components/routes/Navigation";
import Navbar from "./components/_partials/Navbar";
import Footer from "./components/_partials/Footer";

// Thene
import { ThemeProvider } from "./components/ThemeProvider";


function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <Navigation />
        <Footer />
      </ThemeProvider>
    </div>
  );
}
export default App;
