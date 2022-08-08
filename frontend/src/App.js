import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Nav from './components/Navigation'
import Pokelist from './components/PokeList'
import Pagination from './components/Pagination'
import Footer from './components/Footer'
function App() {
  return (
    <div className='App'>
      <Nav />

      <Pokelist />
      
      <Pagination />
      <Footer />
    </div>
  )
}

export default App
