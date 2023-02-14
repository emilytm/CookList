import Header from './components/Header'
import './index.css';

function App() {
  var currentPage = window.location.href.indexOf('myrecipes') > -1 ? 'myrecipes' : 'home'
  return (
    <div className="App">
      <Header currentPage={currentPage} />
    </div>
  );
}

export default App;
