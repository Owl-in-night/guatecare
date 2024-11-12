// import Navbar from './components/_partials/Navbar'
// import Footer from './components/_partials/Footer'
// import Navegation from './components/routes/Navegation'
import Navigation from "./components/routes/Navigation";
import Navbar from "./components/_partials/Navbar";
import Footer from "./components/_partials/Footer";
import { Toaster } from "./components/ui/toaster";
// Thene
import { ThemeProvider } from "./components/ThemeProvider";


function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <Navigation />
        <Toaster />
        <Footer />
      </ThemeProvider>
    </div>
  );
}
export default App;
