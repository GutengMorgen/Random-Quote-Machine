import React, {Component} from 'react';
import * as api from './Api.js';
import {useState, useEffect, useRef} from 'react';
import './styles.css';
import './custom_select.css';
// import * as selectJS from'./select_functions.js';

function TwitterBt()
{
  //dont fucking work
  function handleClick(event) {
    const tweet = event.target;
    const quote = 'negros de mierda los odio';
    tweet.href = `https://twitter.com/intent/tweet?text=${quote}`;
  }

  return (
    <button onClick={handleClick}>tweet</button>
  );
}

function TumblerBt()
{
  function handleClick() {
    
  }

  return (
    <button onClick={handleClick}>facebook</button>
  );
}

function TestingSelection({triggerRef}){
  const [mytags, setTags] = useState([]);

  useEffect(() => {
    async function fetchData(){
      const response = await api.tags();
      const filter = response.filter(item => item.quoteCount > 0);

      const options = filter.map(tag => <span className="option" data-value={tag.slug} data-amount={tag.quoteCount} key={tag._id}>{tag.name}</span>)

      setTags(options);
    }

    fetchData();
  }, []);

  
  const [selectedOption, setSelectedOption] = useState(null);
  const select_trigger = useRef(null);
  // const triggerRef = useRef(null);
  const optionsRef = useRef(null);
  const selectOptionsRef = useRef(null);

  function handleTriggerClick() {
    const selectOptions = selectOptionsRef.current;
    const options = optionsRef.current.querySelectorAll('.option');

    selectOptions.classList.toggle('show');

    // console.log(triggerRef.current.dataset.value);

    options.forEach(option => {
      option.addEventListener('click', () => {
        triggerRef.current.dataset.value = option.dataset.value;
        triggerRef.current.dataset.amount = option.dataset.amount;
        triggerRef.current.textContent = option.textContent;

        if (selectedOption) selectedOption.classList.remove('selected');
        option.classList.add('selected');
        setSelectedOption(option);

        selectOptions.classList.remove('show');

        // on testing
        const button =  document.getElementById('mybutton');
        button.disabled = false;
      })
      // console.log(option.dataset.value, option.dataset.amount);
    });
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (!select_trigger.current.contains(event.target))
        selectOptionsRef.current.classList.remove('show');
    }
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="selector_wrapper">
        <div id="select_trigger" onClick={handleTriggerClick} ref={select_trigger}>
          <span id="trigger" data-value="random" ref={triggerRef}>Random Quote</span>
        </div>
        <div id="select_options" ref={selectOptionsRef}>
          <div id="container_options" ref={optionsRef}>
            <span className="option" data-value="random">Random Quote</span>
            {mytags}
          </div>
        </div>
      </div>
    </div>
  );
}

//textarea
function Mytext({ quote, tags, author, authorSlug}) {

  //on testing
  const defaultSlug = 'albert-einstein';
  let slug = `https://images.quotable.dev/profile/200/${authorSlug || defaultSlug}.jpg`

  return (
  <div>
    <textarea value={quote} disabled></textarea><br />
    <div>
      <img src={slug} alt={authorSlug || defaultSlug} />
    </div>
    <textarea id='tags' value={tags} disabled></textarea><br />
    <textarea id='authorText' value={author} disabled></textarea>
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
      author: '',
      authorSlug: '',
      clicks: 0
    }
    this.handleClicked = this.handleClicked.bind(this);
    this.triggerRef = React.createRef(null);
  }

  testingFetchQuote = async (currentTag) => {

    try {
      const getUniqueQoute = await api.getQouteByTag(currentTag);

      this.setState({
        quote: getUniqueQoute.content,
        tags: getUniqueQoute.tags,
        author: getUniqueQoute.author,
        authorSlug: getUniqueQoute.authorSlug
      })

      // console.log(getUniqueQoute);

    } catch (error) {
      console.log(error);
    }
  }

  handleClicked(event){
    const value = this.triggerRef.current.dataset.value;
    // console.log(`the actual selects value: ${value}`);
    
    const amount = this.triggerRef.current.dataset.amount;

    this.setState (prevState => ({ clicks: prevState.clicks + 1 }))

    //on testing, something this get a bug and disabled before count all quotes
    if(this.state.clicks >= amount - 1){
      this.setState ({clicks: 0});
      event.target.disabled = true;
    }

    console.log(this.state.clicks);

    this.testingFetchQuote(value);
  }

  render(){
    const {quote, tags, author, authorSlug} = this.state;

    return(
      <div className='principal'>
        <div className='item1'>
          <Mytext quote={quote} tags={tags} author={author} authorSlug={authorSlug}/>
          <TwitterBt/>
          <TumblerBt/>
        </div>
        <div className='item2'>
          <TestingSelection triggerRef={this.triggerRef}/>
          <button id='mybutton' onClick={this.handleClicked}>next</button>
        </div>
      </div>
    )
  }
}