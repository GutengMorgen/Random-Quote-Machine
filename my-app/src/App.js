import React, {Component} from 'react';
import * as api from './Api.js';
import {useState, useEffect, useRef} from 'react';
import './styles.css';
import './custom_select.css';
import fallgif from './xd.gif';
import ColorThief from "colorthief";


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

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
  
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta === 0) {
      h = 0;
    }
    else if (cmax === r) {
      h = ((g - b) / delta) % 6;
    }
    else if (cmax === g) {
      h = (b - r) / delta + 2;
    }
    else {
      h = (r - g) / delta + 4;
    }
  
    h = Math.round(h * 60);
  
    if (h < 0) {
      h += 360;
    }
  
    l = (cmax + cmin) / 2;
  
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return {h, s, l};
    // return (`hsl(${h}%, ${s}%, ${l}%)`);
  }

  // const ColorThief = require('colorthief');
  function handleClick(){
    function getDominantColor() {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = slug;

      img.onload = function () {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(img);
        // const rbg = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
        const hsl = rgbToHsl(dominantColor[0], dominantColor[1], dominantColor[2])
        let light, dark;
        if(hsl.l > 50){
          light = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 0.75)`;
          dark = `hsla(${hsl.h}, 50%, 50%, 0.75)`;
        }
        else{
          dark = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 0.75)`;
          light = `hsla(${hsl.h}, 50%, 50%, 0.75)`;
        }
        //convertir a decimal hsl
        const defaultBackground = `linear-gradient(180deg, ${light} 0%, ${dark} 100%)`;
        document.body.style.background = `${defaultBackground}`;
        
        console.log("Color dominante:", hsl, light, dark);
      };
    }
    getDominantColor()


    
  }

  return (
    <div id='imageContainer'>
      <img id='imagen' src={slug || fallgif} alt={authorSlug || 'Image not found, sorry for disappointing you'} onLoad={handleLoad} onClick={handleClick}/>
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