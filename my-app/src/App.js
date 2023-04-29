import React, {Component} from 'react';
import './styles.sass'

function Mynigger()
{
  return (
    <button>Hola</button>
  );
}


class App extends Component{
  render(){
    return(
      <div class='mydiv'>
        <Mynigger/>
      </div>
    )
  }
}

export default App;