import React, {Component} from 'react';
import * as api from './Api.js';
import {useState, useEffect} from 'react';
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

function TestingSelection(){
  const [mytags, setTags] = useState([]);

  useEffect(() => {
    async function fetchData(){
      const response = await api.tags();
      const filter = response.filter(item => item.quoteCount > 0);
      
      const options = filter.map(tag => <option value={tag.slug} key={tag._id}>{tag.name}</option>);

      setTags(options);
    }

    fetchData();
  }, []);

  return (
    <div>
      <select id="mySelect">
        <option value="random" defaultValue={true}>Random</option>
        {mytags}
      </select>
    </div>
  );
}

//textarea
function Mytext({ quote, tags, author }) {
  return (
  <div>
    <textarea value={quote} disabled></textarea><br />
    <textarea id='tags' value={tags} disabled></textarea>
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
      tags: '',
      author: ''
    }
    this.handleClicked = this.handleClicked.bind(this);
  }

  testingFetchQuote = async (currentTag) => {

    try {
      const getUniqueQoute = await api.getQouteByTag(currentTag);

      this.setState({
        quote: getUniqueQoute.content,
        tags: getUniqueQoute.tags,
        author: getUniqueQoute.author
      })

      // console.log(getUniqueQoute);

    } catch (error) {
      console.log(error);
    }
  }

  handleClicked(){
    const value = document.getElementById('mySelect').value;
    // console.log(`the actual selects value: ${value}`);
    
    this.testingFetchQuote(value);
  }

  render(){
    const {quote, tags, author} = this.state;

    return(
      <div className='principal'>
        <div className='item1'>
          <Mytext quote={quote} tags={tags} author={author}/>
          <TwitterBt/>
          <TumblerBt/>
        </div>
        <div className='item2'>
          <TestingSelection/>
          <button onClick={this.handleClicked}>next</button>
        </div>
      </div>
    )
  }
}