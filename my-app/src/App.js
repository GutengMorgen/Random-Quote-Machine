import React, {Component, useCallback, useState, useEffect, useRef} from 'react';
import {SwitchTransition, CSSTransition} from 'react-transition-group';
import * as api from './Api.js';
import ColorThief from 'colorthief';
import rgbConverter from './rgbTohsl.js';
import fallgif from './zen-meditation.gif';
import './styles.css';

function TwitterBt({text})
{
  const url = `https://twitter.com/intent/tweet?text="${text}"`;

  return (
    <button id='tweetContainer'>
      <a href={url} target='_blank' rel="noreferrer" id='tweet-quote'>tweet</a>
    </button>
  );
}

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

function MyImage ({author, setBackgroundStyle}){
  const [slug, setSlug] = useState(null);
  const imgRef = useRef(null);
  useEffect(() => {
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
  }, [author]);

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
    };
    
    getDominantColor();
  }, [slug, setBackgroundStyle]);

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
        <span id='text' style={quote.length >= 200 ? {alignItems: "baseline"} : {alignItems: "center"}}>
          "{quote}"
        </span>
      </CSSTransition>
    </SwitchTransition>
    <span className='tagsContainer' id='tags'>{tags}</span>
    <TwitterBt text={quote}/>
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
      backgroundStyle: {},
      isLoaded: false // nuevo estado
    }
    this.triggerRef = React.createRef(null);
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
    this.setState({ isLoading: true });

    const value = this.triggerRef.current.value;
    this.fetchQuoteByTag(value);

    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 5000);
  }

  componentDidMount() {
    if (!this.state.isLoaded) { // llama a fetchQuoteByTag() solo si isLoaded es false
      this.fetchQuoteByTag('random');
      this.setState({ isLoaded: true }); // establece isLoaded en true después de que se llama a fetchQuoteByTag()
    }
  }

  setBackgroundStyle = (style) => {
    this.setState({backgroundStyle : style});
  }

  render(){
    const {quote, tags, author, isLoading, backgroundStyle} = this.state;

    return(
      <div id='quote-box' style={backgroundStyle}>
          <div className='item1'>
            <Mytext quote={quote} tags={tags}/>
            <div className='AboutAuthor'>
              <MyImage author={author} setBackgroundStyle={this.setBackgroundStyle}/>
              <span className='nameContainer' id='author'>{author}</span>
            </div>
          </div>
          <div className='item2'>
            <Selection triggerRef={this.triggerRef}/>
            <button id='new-quote' onClick={this.handleClicked} disabled={isLoading}>{isLoading ? ('Loading...'): <span>Next Quote</span> }</button>
          </div>
      </div>
    )
  }
}

export default App;