import React, {Component, useCallback, useState, useEffect, useRef} from 'react';
import * as api from './Api.js';
import rgbConverter from './rgbTohsl.js';
import ColorThief from "colorthief";
import './styles.css';
import fallgif from './zen-meditation.gif';
import {SwitchTransition, CSSTransition} from 'react-transition-group';
import 'bootstrap-select';
import $ from 'jquery';

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

$.fn.selectpicker.Constructor.BootstrapVersion = '4';

function Selection({triggerRef}){
  const [mytags, setTags] = useState([]);

  useEffect(() => {
    async function fetchData(){
      const getTags = await api.newTags();
      const getdata = getTags.data;

      const options = getdata.map(tag => <option key={tag} value={tag}>{tag}</option>)
      setTags(options);
    }

    fetchData();
  }, []);

  return (
    <div className="selector_wrapper">
        <select id="all-generes" ref={triggerRef}>
          <option value="random">Random</option>
          {mytags}
        </select>
    </div>
  );
}

function MyImage ({author, setLoading, setBackgroundStyle}){
  const [slug, setSlug] = useState(null);
  const imgRef = useRef(null);
  useEffect(() => {
    setLoading(true);
    async function fetchImage() {
      try {
        const url = await api.getWikiImage(author);
        const page = url.query && Object.values(url.query.pages)[0];
        setSlug(page?.original?.source || fallgif);
      } catch (error) {
        console.error(error);
      }
    }

    fetchImage();
  }, [author, setLoading]);

  const handleLoad = useCallback(() => {

    const getDominantColor = () => {
      const img = imgRef.current;
      img.crossOrigin = "Anonymous";
      img.src = slug;
      img.onload = () => {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(img);
        const hsl = rgbConverter(...dominantColor)
        const {h, s, l} = hsl;
        const isLight = l > 40;

        setBackgroundStyle ({
          backgroundColor : `hsl(${h}, ${isLight ? s : 40}%, ${isLight ? l : 50}%)`
        })
      };
      
      setLoading(false);
    };
    
    getDominantColor();
  }, [slug, setLoading, setBackgroundStyle]);

  return (
    <div id="imageContainer">
      <SwitchTransition >
        <CSSTransition classNames="fade" key={slug} addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}>
          <img
          ref={imgRef}
          id="imagen"
          src={slug || fallgif}
          alt={author || 'Image not found, sorry for disappointing you'}
          onLoad={handleLoad}
        />
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

function Mytext({ quote, tags }) {

  return (
  <div className='AboutQuote'>
    <SwitchTransition>
      <CSSTransition classNames="fade" key={quote} addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}>
        <span id='quoteContainer' style={quote.length >= 200 ? {alignItems: "baseline"} : {alignItems: "center"}}>
          "{quote}"
        </span>
      </CSSTransition>
    </SwitchTransition>
    <span className='tagsContainer' id='tags'>{tags}</span>
  </div>
  );
}

class App extends Component{
  constructor(props){
    super(props)
    this.state = {
      quote: '',
      tags: '',
      author: '',
      isLoading: false,
      backgroundStyle: {}
    }
    this.triggerRef = React.createRef(null);
  }

  setIsLoading = (isLoading) => {
    this.setState({ isLoading });
  }

  fetchQuoteByTag = async (currentTag) => {
    try {
      const getNewshit = await api.newGetQuoteByTag(currentTag);
      const getdata = getNewshit.data[0];

      this.updateQuoteData(getdata);
    } catch (error) {
      console.log(error);
    }
  }

  updateQuoteData = (data) => {
    this.setState({
      quote: data.quoteText,
      tags: data.quoteGenre,
      author: data.quoteAuthor
    })
  }

  handleClicked = () => {
    const value = this.triggerRef.current.value;
    this.fetchQuoteByTag(value);
  }

  fetchCalled = false;
  componentDidMount() {
    if (!this.fetchCalled) {
      this.fetchCalled = true;
      this.fetchQuoteByTag('random');
    }
  }

  setBackgroundStyle = (style) => {
    this.setState({backgroundStyle : style})
  }

  render(){
    const {quote, tags, author, isLoading, backgroundStyle} = this.state;

    return(
      <div className='Container' style={backgroundStyle}>
          <div className='item1'>
            <Mytext quote={quote} tags={tags}/>
            <div className='AboutAuthor'>
              <MyImage author={author} setLoading={this.setIsLoading} setBackgroundStyle={this.setBackgroundStyle}/>
              <span className='nameContainer' id='authorText'>{author}</span>
            </div>
          </div>
          {/* <TwitterBt/>
          <TumblerBt/> */}
          <div className='item2'>
            <Selection triggerRef={this.triggerRef}/>
            <button id='mybutton' onClick={this.handleClicked} disabled={isLoading}>{isLoading ? ('Loading...'): <span>Next Quote</span> }</button>
          </div>
      </div>
    )
  }
}

export default App;