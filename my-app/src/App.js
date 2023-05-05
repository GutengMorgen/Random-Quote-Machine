import React, {Component} from 'react';
import * as api from './Api.js';
import {useState, useEffect, useRef} from 'react';
import './styles.css';
import './custom_select.css';
import fallgif from './xd.gif';

/*function TwitterBt()
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
}*/

/*function TumblerBt()
{
  function handleClick() {
    
  }

  return (
    <button onClick={handleClick}>facebook</button>
  );
}*/

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
  );
}

function MyImage(props){
  const {authorSlug, author, setLoading} = props;

  //on testing - if there not picture of the author so put the default-user.png or try to put a gif of something
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    setLoading(true);
    async function fetchImage() {
      const url = await api.getWikiImage(author);

      if(url.query)
      {
        const page = Object.values(url.query.pages)[0];
        //on testing
        if (page.original && page.original.source)
        {  
          const imagesUrl = page.original.source;
          // console.log(url);
          setSlug(imagesUrl);
        }
        else{
          setSlug(fallgif);
          setLoading(false);
        }
      }
      
    }

    fetchImage();
  }, [author, setLoading]);

  function handleLoad(){
    setLoading(false);
    // console.log('loading....');
  }

  return (
    <div id='imageContainer'>
      <img src={slug || fallgif} alt={authorSlug || 'Image not found, sorry for disappointing you'} onLoad={handleLoad}/>
    </div>
  )
}


//textarea
function Mytext(props) {
  const { quote, tags, author, authorSlug, setIsLoading} = props;

  return (
  <div className='item1'>
    <div className='AboutQuote'>
      <span id='quoteContainer'>"{quote}"</span>
      <span className='tagsContainer' id='tags'>{tags}</span>
    </div>
    <div className='AboutAuthor'>
          <MyImage authorSlug={authorSlug} author={author} setLoading={setIsLoading}/>
          <span className='nameContainer' id='authorText'>{author}</span>
    </div>
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
      clicks: 0,
      isLoading: false
    }
    this.handleClicked = this.handleClicked.bind(this);
    this.triggerRef = React.createRef(null);
  }

  setIsLoading = (isLoading) => {
    this.setState({ isLoading });
  }

  testingFetchQuote = async (currentTag) => {
    this.setIsLoading(true);
    try {
      const getUniqueQoute = await api.getQouteByTag(currentTag);

      this.setState({
        quote: getUniqueQoute.content,
        tags: getUniqueQoute.tags,
        author: getUniqueQoute.author,
        authorSlug: getUniqueQoute.authorSlug,
      })
      // console.log(getUniqueQoute);

    } catch (error) {
      console.log(error);
      this.setIsLoading(false);
    }
    
    this.setIsLoading(false);
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
    // console.log(this.state.clicks);

    this.testingFetchQuote(value);
  }

  componentDidMount() {
    // Llama a testingFetchQuote una vez que la página se haya cargado
    this.testingFetchQuote('random');
  }

  render(){
    const {quote, tags, author, authorSlug, isLoading} = this.state;

    return(
      <div>
        <Mytext quote={quote} tags={tags} author={author} authorSlug={authorSlug} setIsLoading={this.setIsLoading}/>
        
        {/* <TwitterBt/>
        <TumblerBt/> */}
        <div className='item2'>
          <TestingSelection triggerRef={this.triggerRef}/>
          <button id='mybutton' onClick={this.handleClicked} disabled={isLoading ? (true) : (false)}>{isLoading ? ('loading...'): ('next')}</button>
        </div>
      </div>
    )
  }
}