import React from 'react';
import $ from 'jquery';

export default class WeatherWiki extends React.Component {
  constructor() {
    super();
    this.state = {
      searchString : '',
      showResults : false,
      resultsData: {},
      loading: false
    }
  }

  callWikiAPI(searchStr) {
    this.setState({ loading: true })
    let api = 'http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=15&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';

    $.ajax({
      url: api + searchStr,
      dataType: 'jsonp',
      success: responseData => {
        this.setState({
          showResults: true,
          resultsData: responseData,
          loading: false
        });
      }
    });
  }

  searchClick(e) {
    this.setState({
      showResults: false
    });
    this.callWikiAPI(this.state.searchString);
  }

  inputChange(e) {
    this.setState({
      searchString : e.target.value
    });
  }

  render() {
    return (
      <div className='container'>
        <Searcher
          searchClickHandler={this.searchClick.bind(this)}
          inputChangeHandler={this.inputChange.bind(this)}
        />
        <Results
          data={this.state.resultsData}
          show={this.state.showResults}
        />
        {this.state.loading ? <Loading /> : null}
      </div>
    )
  }
}

class Searcher extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <input
          type='text'
          onChange={this.props.inputChangeHandler}
        ></input>
        <button
          onClick={this.props.searchClickHandler}
        >amazeballs</button>
      </div>
    )
  }

}

class Results extends React.Component {
  render() {
    let list = [];

    if(this.props.data.query) {
      let pages = this.props.data.query.pages;
      for(let page in pages) {
        if( pages.hasOwnProperty(page) ) {
          list.push(<ResultItem key={page} val={this.props.data.query.pages[page]}/>)
        }
      }
    } else {
      list = <NoResults />
    }

    return (
      this.props.show ?
      <ul>
        {list}
      </ul>
      : null
    )
  }
}

const Loading = () => {
  return <div className='loading'>Loading...</div>
}

const NoResults = () => {
  return (
    <div>
      <h2>Sorry, your search string did not return any results.</h2>
    </div>
  )
}
//react cares about capitalisation of component names, like below.
//if this was named resultItem, the component simply would not render.
const ResultItem = (props) => {
  let wikipediaAddress = 'http://en.wikipedia.org/?curid=';
  return (
    <li>
      <a href={wikipediaAddress + props.val.pageid}>{props.val.title}</a>
      <p>{props.val.extract}</p>
      {props.val.thumbnail ? <img src={props.val.thumbnail.source} /> : null}
    </li>
  )
}
