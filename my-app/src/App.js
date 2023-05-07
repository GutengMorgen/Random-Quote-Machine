import React, {Component, useCallback, useState, useEffect, useRef} from 'react';
import * as api from './Api.js';
import rgbConverter from './rgbTohsl.js';
import ColorThief from "colorthief";
import './styles.css';
import fallgif from './zen-meditation.gif';

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

function Selection({triggerRef}){
  const [mytags, setTags] = useState([]);

  useEffect(() => {
    async function fetchData(){
      const getTags = await api.newTags();
      const getdata = getTags.data;

      const options = getdata.map(tag => <option key={tag} value={tag}>{tag}</option>)
      // console.log(getdata);
      setTags(options);
    }

    fetchData();
  }, []);

  return (
    <div className="selector_wrapper">
        <select name="AllGeneres" id="all-generes" ref={triggerRef}>
          <option value="random">Random</option>
          {mytags}
        </select>
    </div>
  );
}

function MyImage({author, setLoading}){
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    setLoading(true);
    async function fetchImage() {
      try {
        const url = await api.getWikiImage(author);
        const page = url.query && Object.values(url.query.pages)[0];
        setSlug(page?.original?.source || fallgif);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchImage();
  }, [author, setLoading]);

  const imgRef = useRef(null);
  const handleLoad = useCallback(() => {
    setLoading(false);

    const getDominantColor = () => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = slug;
      img.onload = () => {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(img);
        const hsl = rgbConverter(...dominantColor)

        const hslStyle = (h, s, l, a) => `hsla(${h}, ${s}%, ${l}%, ${a})`;
        const {h, s, l} = hsl;
        const isLight = l > 50;
        const lightStyle = hslStyle(h, isLight ? s : 50, isLight ? l : 50, 0.75);
        const darkStyle = hslStyle(h, isLight ? 50 : s, isLight ? 50 : l, 0.75);

        document.body.style.background = `linear-gradient(180deg, ${lightStyle} 0%, ${darkStyle} 100%)`;
        imgRef.current.style.border = `2px solid hsl(${h}, ${s}%, ${l}%)`;
        // console.log("Color dominante:", hsl, lightStyle, darkStyle);
        
      };
    };

    getDominantColor();
  }, [slug, setLoading]);

  return (
    <div id="imageContainer">
      <img
        id="imagen"
        src={slug || fallgif}
        alt={author || 'Image not found, sorry for disappointing you'}
        onLoad={handleLoad}
        ref={imgRef}
      />
    </div>
  )
}

function Mytext(props) {
  const { quote, tags, author, setIsLoading} = props;

  return (
  <div className='item1'>
    <div className='AboutQuote'>
      <span id='quoteContainer'>"{quote}"</span>
      <span className='tagsContainer' id='tags'>{tags}</span>
    </div>
    <div className='AboutAuthor'>
      <MyImage author={author} setLoading={setIsLoading}/>
      <span className='nameContainer' id='authorText'>{author}</span>
    </div>
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
      isLoading: false
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

  render(){
    const {quote, tags, author, isLoading} = this.state;

    return(
      <div>
        <Mytext quote={quote} tags={tags} author={author} setIsLoading={this.setIsLoading}/>
        {/* <TwitterBt/>
        <TumblerBt/> */}
        <div className='item2'>
          <Selection triggerRef={this.triggerRef}/>
          <button id='mybutton' onClick={this.handleClicked} >{isLoading ? ('Loading...'): ('Next Quote')}</button>
        </div>
      </div>
    )
  }
}

export default App;