import React from "react";
import Lists from "./lists";
import CreateList from "./createlist";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      alldata: [],
      singledata: {
        title: "",
        author: ""
      }
    };
  }

  getLists = () => {
    fetch("http://localhost:5000/posts")
    .then(res => res.json())
    .then(result =>
      this.setState({
        loading: false,
        alldata: result
      })
    )
    .catch(console.log);
  }

  handleChange = (event) => {
    let title = this.state.singledata.title;
    let author = this.state.singledata.author;
    if (event.target.name === "title") title = event.target.value;
    else author = event.target.value;

    this.setState({
      singledata: {
        title: title,
        author: author,
      }
    })
  }

  createList = () => {
    fetch(
      "http://localhost:5000/posts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state.singledata)
      }
    )
    .then(result => {
      this.setState({
        singledata: {
          title: "",
          author: ""
        }
      });
      this.getLists();
    });
  }

  getList = (event, id) => {
    this.setState(
      {
        singledata: {
          title: "Loading...",
          author: "Loading..."
        }
      },
      () => {
        fetch(`http://localhost:5000/posts/${id}`)
        .then(res => res.json())
        .then(result => {
          this.setState({
            singledata: {
              title: result.title ? result.title : "",
              author: result.author ? result.author : ""
            }
          });
        });
      }
    );
  }

  updateList = (event, id) => {
    fetch(
      `http://localhost:5000/posts/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state.singledata)
      }
    )
    .then(res => res.json())
    .then(result => {
      this.setState({
        singledata: {
          title: result.title ? result.title : "",
          author: result.author ? result.author : ""
        }
      });
      this.getLists();
    });
  }

  deleteList = (event, id) => {
    fetch(
      `http://localhost:5000/posts/${id}`,
      {
        method: "DELETE"
      }
    )
    .then(res => res.json())
    .then(result => {
      this.setState({
        singledata: {
          title: "",
          author: ""
        }
      });
      this.getLists();
    });
  }

  render() {
    const listTable = this.state.loading ? (
      <span>Loading Data...Please be patient.</span>
    ) : (
      <Lists
        alldata={this.state.alldata}
        singledata={this.state.singledata}
        getList={this.getList}
        updateList={this.updateList}
        deleteList={this.deleteList}
        handleChange={this.handleChange}
      >
      </Lists>
    );

    return (
      <div className="container">
        <span className="title-bar">
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.getLists}
          >
            Get Lists
          </button>
          <CreateList 
            singledata={this.state.singledata}
            handleChange={this.handleChange}
            createList={this.createList}
          />
        </span>
        {listTable}
      </div>
    )
  }

}

export default App;