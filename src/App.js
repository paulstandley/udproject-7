import React from 'react';
import * as BooksAPI from './BooksAPI'
import './App.css'
import { Route } from "react-router-dom";
import { Link } from "react-router-dom";
import ListOfBooks from './ListOfBooks';
//import SearchForBooks from './SearchForBooks';
 
class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    books: [],
    query: '',
    displayBooks: [],
    num: 1,
    shelf: ["currentlyReading", "wantToRead", "read", "none"],
    showSearchPage: false
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {this.setState({books})})
  }
  moveBookHandler = (evt) => {

    console.log(evt.target.value)
    console.log(this.state.shelf[0])
    
  }
  /* */
  updateDisplay = (query) => {
    let displayBooks = [];
    this.setState({query});
    if(query) {
      BooksAPI.search(query).then(data => {
        if(data.length) {
          displayBooks = data.map(() => {
            let num = this.state.books.findIndex(compVal => compVal.id === data.id);
            if(num >= 0) {
              return this.state.books[num];
            }else{
              return data;
            }
          })
        }
        this.setState({displayBooks});
      })
    }
    else{
      this.setState({displayBooks});
    }
  }

  
/* Two new components SearchForBooks and ListOfBooks for the instate TODO. it is done :)  */
  render() {
    const  { query } = this.state;
    return (
      <div className="app">
        <Route exact path='/search' render={() =>  (

          <div className="search-books">
          <div className="search-books-bar">
            <Link className="close-search" to='./'>Close</Link>
            <div className="search-books-input-wrapper">
                  {/*
                    NOTES: The search from BooksAPI is limited to a particular set of search terms.
                    You can find these search terms here:
                    https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
  
                    However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                    you don't find a specific author or title. Every search is limited by search terms.
                  */}
            <input type="text" placeholder="Search by title or author" value={query} onChange={(evt) => this.updateDisplay(evt.target.value)}/>
            </div>
          </div>
          <div className="search-books-results">
            <ol className="books-grid">
              {this.state.displayBooks.map((book, index, array) => (
                <li key={`KEYNUM_${Math.floor(Math.random() * 100000)}`}>
                  <div className="book">
                     <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: book[index].imageLinks ? `url(${book[index].imageLinks.thumbnail})` : '' }}></div>
                        <div className="book-shelf-changer">
                          <select value={this.state.shelf[0]} onChange={(evt) => this.moveBookHandler(evt)}>
                            <option value="move" disabled={true}>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">{book[index].title ? book[index].title : ''}</div>
                      <div className="book-authors">{book[index].authors ? book[index].authors.toString() : ''}</div>
                    </div>
                  </li>
                )) }
            </ol>
          </div>
        </div>
       )} />
        <Route exact path='/' render={() => ( 
          <ListOfBooks/> 
        )} />
      </div>
    )
  }
}

export default BooksApp
