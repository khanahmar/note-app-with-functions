import "./App.css"
import Header from "../src/components/header/Header"
import List from "../src/components/list/List"
import Textarea from "../src/components/textarea/Textarea"

function App() {
  const getData = (data) => {
    console.log(data)
  }
  return (
    <div className="App">
      <List data={getData} />
      <div className="appBody">
        <Header />
        <Textarea />
      </div>
    </div>
  )
}

export default App
