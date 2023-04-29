import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.css'

function TwitterBt()
{
  return (
    <button>tweet</button>
  );
}

function TumblerBt()
{
  return (
    <button>tumbler</button>
  );
}

//principal button
function QuoteBt({text, setColor, color})
{
  const handleClick = () =>
  {
    console.log(text);
    setColor(color === 'blue' ? 'red' : 'blue');
  }

  return (
    <button style={{backgroundColor: color}} onClick={handleClick}>
      quote
    </button>
  );
}

//textarea
function Mytext({onChange, value})
{
  const handleOnChange = (event) =>
  {
    onChange(event.target.value);
  }

  return (
    <textarea value={value} onChange={handleOnChange}></textarea>
  )
}

//proptypes
QuoteBt.prototype = {
  text: PropTypes.string.isRequired,
  setColor: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired
}
Mytext.prototype = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

//class default App
class App extends Component{
  constructor(props){
    super(props)
    this.state = {
      text: '',
      color: 'red'
    }
  }

  handleTextChange = (text) => {
    this.setState({text});
  }

  handleSetColor = (color) => {
    this.setState({color})
  }

  render(){
    const {text, color} = this.state;

    return(
      <div className='mydiv'>
        <p>
          <Mytext onChange={this.handleTextChange} value={text}/>
        </p>
        <TwitterBt/>
        <TumblerBt/>
        <QuoteBt text={text} setColor={this.handleSetColor} color={color}/>
      </div>
    )
  }
}

export default App;