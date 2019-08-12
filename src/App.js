import React, { Component } from "react";
import "./App.css";
import "./search-icon.png";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      cards: [],
      page: 1,
      loading: false,
      sort: "name",
      name: ""
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentWillMount() {
    this.scrollListener = window.addEventListener("scroll", e => {
      this.handleScroll(e);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidMount() {
    this.load();
  }

  display() {
    let buffer = [];
    let len = this.state.cards.length;
    this.state.data.forEach((item, i) => {
      buffer.push(
        <article className="card" key={len + i}>
          <header className="title">
            <h4>{item.name}</h4>
          </header>
          <figure className="image">
            <img src={item.imageUrl} alt="" />
          </figure>
          <main className="description">
            <div>
              by: <span className="bold">{item.artist}</span>
            </div>
            <div>
              set name: <span className="bold">{item.setName}</span>
            </div>
            <div>
              original type: <span className="bold">{item.originalType}</span>
            </div>
          </main>
        </article>
      );
    });
    this.setState({ cards: this.state.cards.concat(buffer) });
  }

  handleScroll() {
    if (this.state.loading) {
      return;
    }
    let lastCard = document.querySelector("section > article:last-child");
    let lastOffset = lastCard.offsetTop + lastCard.clientHeight;
    let pageOffset = window.pageYOffset + window.innerHeight;
    if (pageOffset > lastOffset) {
      this.load();
    }
  }

  // TODO: allow revert to default view
  handleSearch(e) {
    e.preventDefault();
    let input = e.target.elements.search.value;
    input.trim();
    if (!input) {
      return;
    }
    this.setState(
      {
        data: [],
        cards: [],
        page: 1,
        name: input
      },
      this.load
    );
  }

  handleSort(e) {
    e.preventDefault();
    let input = e.target.value;
    this.setState(
      {
        data: [],
        cards: [],
        page: 1,
        sort: input
      },
      this.load
    );
  }

  // TODO: calculate the number of cards to fill the screen
  // TODO: handle case where no more cards can be loaded
  load() {
    this.setState({ loading: true });
    let self = this;
    let uri =
      process.env.REACT_APP_BASE_URI +
      `&pageSize=20&page=${this.state.page}&orderBy=${this.state.sort}`;
    if (this.state.name) {
      uri = encodeURI(
        process.env.REACT_APP_BASE_URI +
          `&page=${this.state.page}&name=${this.state.name}&orderBy=${
            this.state.sort
          }`
      );
    }
    fetch(uri)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        self.setState(
          {
            data: json.cards,
            page: self.state.page + 1,
            loading: false
          },
          self.display
        );
      })
      .catch(function(e) {
        // TODO: Nicer error handling
        alert(e.toString());
      });
  }

  render() {
    return (
      <div>
        <header className="header">
          <div className="wrapper">
            <h1>Welcome to Magic Creature Cards!</h1>
          </div>
          <div className="wrapper">
            <form onSubmit={this.handleSearch}>
              <input
                name="search"
                placeholder="Search by name..."
                autoComplete="off"
              />
              <button>
                <span className="search-icon" />
              </button>
            </form>
            <form onSubmit={this.handleSort}>
              <label className="sort-label">Sort by:</label>
              <select
                name="sort"
                value={this.state.sort}
                onChange={this.handleSort}
              >
                <option value="name">Name</option>
                <option value="artist">Artist</option>
                <option value="setName">Set</option>
                <option value="type">Type</option>
              </select>
            </form>
          </div>
        </header>
        <main>
          <section className="card-container">{this.state.cards}</section>
        </main>
        {this.state.loading ? (
          <div className="loading">Loading&#8230;</div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default App;
