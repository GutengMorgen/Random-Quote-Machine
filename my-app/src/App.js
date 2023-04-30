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

function Selector()
{
  return (
    <select name="mySelector" id="selector">
      <option value="1">num1</option>
      <option value="2">num2</option>
      <option value="3">num3</option>
      <option value="4">num4</option>
    </select>
  )
}


//principal button
function QuoteButton({ isBlue, setColor }) {
  const buttonColor = isBlue ? 'red' : 'blue';

  return (
    <button style={{ backgroundColor: buttonColor }} onClick={setColor}>
      quote
    </button>
  );
}

//textarea
function Mytext({ quote, author }) {
  return (
  <div>
    <textarea value={quote} readOnly></textarea>
    <p>
      <textarea id='authorText' value={author} readOnly></textarea>
    </p>
  </div>
  );
}

//proptypes
QuoteButton.prototype = {
  setColor: PropTypes.func.isRequired,
  isBlue: PropTypes.bool.isRequired
}
Mytext.prototype = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired
}

//class default App
class App extends Component{
  constructor(props){
    super(props)
    this.state = {
      quote: '',
      author: '',
      isBlue: false
    }
    this.handleClicked = this.handleClicked.bind(this);
  }

  fetchQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      this.setState({
        quote: data.content,
        author: data.author
      });
    }
    catch (error){
      console.log(error);
    }
  }

  handleClicked(){
    this.setState({isBlue: !this.state.isBlue})
    this.fetchQuote();
  }

  render(){
    const {quote, author, isBlue} = this.state;

    return(
      <div className='principal'>
        <div className='item1'>
          <Mytext quote={quote} author={author}/>
          <TwitterBt/>
          <TumblerBt/>
        </div>
        <div className='item2'>
          <Selector/>
          <QuoteButton setColor={this.handleClicked} isBlue={isBlue}/>
        </div>
      </div>
    )
  }
}

export default App;