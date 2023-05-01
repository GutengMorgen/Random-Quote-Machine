import React, {Component} from 'react';
import * as api from './Api.js';
import './styles.css';

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
      <option value="random">Random</option>
      <option value="famous-quotes">Famous Quotes</option>
      <option value="science">Science</option>
      <option value="technology">Technology</option>
    </select>
  )
}

//textarea
function Mytext({ quote, author }) {
  return (
  <div>
    <textarea value={quote} disabled></textarea>
    <p>
      <textarea id='authorText' value={author} disabled></textarea>
    </p>
  </div>
  );
}

//class default App
export default class App extends Component{
  constructor(props){
    super(props)
    this.state = {
      quote: '',
      author: ''
    }
    this.handleClicked = this.handleClicked.bind(this);
  }

  fetchQuote = async () => {
    try {
      const getRandomQuotes = await api.randomQuotes();

      this.setState({
        quote: getRandomQuotes.content,
        author: getRandomQuotes.author
      })
    }
    catch (error) {
      console.log(error);
    }
  }

  handleClicked(){
    this.fetchQuote();
    api.GetData();
  }

  render(){
    const {quote, author} = this.state;

    return(
      <div className='principal'>
        <div className='item1'>
          <Mytext quote={quote} author={author}/>
          <TwitterBt/>
          <TumblerBt/>
        </div>
        <div className='item2'>
          <Selector/>
          <button onClick={this.handleClicked}>next</button>
        </div>
      </div>
    )
  }
}