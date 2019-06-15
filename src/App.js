import React, { Component } from 'react'
import './App.css'
import Cute from './cute.png';

// const COLORS = {
//   Psychic: "#f8a5c2",
//   Fighting: "#f0932b",
//   Fairy: "#c44569",
//   Normal: "#f6e58d",
//   Grass: "#badc58",
//   Metal: "#95afc0",
//   Water: "#3dc1d3",
//   Lightning: "#f9ca24",
//   Darkness: "#574b90",
//   Colorless: "#FFF",
//   Fire: "#eb4d4b"
// }

class App extends Component {

  state = {
    allCard : [],
    pokedex : [],
    modalShow : false
  }

  componentDidMount = async () => {
    let { allCard } = this.state;
    const cardResult = await fetch('http://localhost:3030/api/cards');
    const card = await cardResult.json();
    allCard = card;
    this.setState({allCard});
    // fetch('http://localhost:3030/api/cards').then((data) => data.json()).then((dataJ) => {
    //   allCard = dataJ;
    //   this.setState({allCard})
    // });
  }

  addToPokedex = (data = {}) => {
    let { pokedex } = this.state;
    pokedex.push(data);
    this.setState(pokedex);
  }

  deleteFromPokedex = (index) => {
    let { pokedex } = this.state;
    pokedex.splice(index, 1);
    this.setState({pokedex});
  }

  onModalClick = () => {
    let { modalShow } = this.state;
    this.setState({modalShow : !modalShow});
  }

  searchFunction = async (event) => {
    let { allCard } = this.state;
    const pokemonNameAndType = event.target.value;
    const cardResult = await fetch(`http://localhost:3030/api/cards?name=${pokemonNameAndType}&type=${pokemonNameAndType}`);
    const card = await cardResult.json();
    allCard = card;
    this.setState({allCard});
  }

  renderMyPokedex = () => {
    let { pokedex } = this.state;
    return (
      <div>
        { pokedex && pokedex.map((data, key) => {
          let count = 0;
          let pictureToShow = [];
          const hpCon = data && data.hp && parseInt(data.hp) || 0;
          const hpCal = (hpCon > 100? 100 : hpCon > 0? hpCon : 0);
          const strCal = (data && data.attacks && (data.attacks.length === 2? 100 : data.attacks.length === 1? 50 : 0) || 0);
          const weakCal = (data && data.attacks && (data.weaknesses.length === 2? 100 : data.weaknesses.length === 1? 50 : 0) || 0);
          const damageCal = (data && data.attacks && data.attacks.reduce((old, data, key) => {
            let damage = data.damage.replace(/\D/g,'');
            old = old + parseInt(damage);
            return old;
          },0) || 0);
          const happiness = ((hpCal / 10) + (damageCal /10 ) + 10 - (weakCal)) / 5;
          const happinessCal = Math.abs(Math.round(happiness));
          while(count < happinessCal){
            pictureToShow.push(<img style={{width: '15%', marginRight: '1%'}} src={Cute} />);
            count++;
          }
          return (
            <div className="cardContainer" key={key}>
              <div className="cardPicture">
                <img src={`${data.imageUrl}`} />
              </div>
              <div className="cardDetail">
                <p>
                  {data.name}
                </p>
                <div style={{display: 'flex', justify: 'flex-start', marginBottom: '1vw'}}>
                  <p style={{width:"40%", margin: 0}}>HP</p>
                  <div style={{width: "60%"}}>
                    <div style={{width:`${hpCal}%`, backgroundColor:'red', borderRadius:'20px'}}>
                      &nbsp;
                    </div>
                  </div>
                </div>
                <div style={{display: 'flex', justify: 'flex-start', marginBottom: '1vw'}}>
                  <p style={{width:"40%", margin: 0}}>STR</p>
                  <div style={{width: "60%"}}>
                    <div style={{width:`${strCal}%`, backgroundColor:'red', borderRadius:'20px'}}>
                      &nbsp;
                    </div>
                  </div>
                </div>
                <div style={{display: 'flex', justify: 'flex-start', marginBottom: '1vw'}}>
                  <p style={{width:"40%", margin: 0}}>WEAK</p>
                  <div style={{width: "60%"}}>
                    <div style={{width:`${weakCal}%`, backgroundColor:'red', borderRadius:'20px'}}>
                      &nbsp;
                    </div>
                  </div>
                </div>
                <div style={{display: 'flex', justify: 'flex-start'}}>
                  <p style={{width:"40%", margin: 0}}>HAPPINESS</p>
                  <div style={{width: "60%"}}>
                    {pictureToShow}
                  </div>
                </div>
              </div>
              <div className="addPokedex">
                <p style={{margin: `0 0 0 5%`, cursor: `pointer`}} onClick={()=>{this.deleteFromPokedex(data)}}>
                    Delete
                </p>
              </div>

            </div>
          )
        })}
      </div>
    )
  }

  renderSearchPokedex = () => {
    let { allCard, pokedex } = this.state;
    return (
      <div className="fullSearchPokedexContainer">
        <div className="toCloseModal" onClick={this.onModalClick} />
        <div className="searchContainer">
          <div className="searchBoxContainer">
            <input className="searchPokedexInput" type="text" onChange={this.searchFunction} />
          </div>
          <div className="searchResult">
            { allCard && allCard.cards && allCard.cards.map((data, key) => {
              let count = 0;
              let pictureToShow = [];
              let checkExist = pokedex.findIndex(item => item.id === data.id );
              const hpCon = data && data.hp && parseInt(data.hp) || 0;
              const hpCal = (hpCon > 100? 100 : hpCon > 0? hpCon : 0);
              const strCal = (data && data.attacks && (data.attacks.length === 2? 100 : data.attacks.length === 1? 50 : 0) || 0);
              const weakCal = (data && data.attacks && (data.weaknesses.length === 2? 100 : data.weaknesses.length === 1? 50 : 0) || 0);
              const damageCal = (data && data.attacks && data.attacks.reduce((old, data, key) => {
                let damage = data.damage.replace(/\D/g,'');
                old = old + parseInt(damage);
                return old;
              },0) || 0);
              const happiness = ((hpCal / 10) + (damageCal /10 ) + 10 - (weakCal)) / 5;
              const happinessCal = Math.abs(Math.round(happiness));
              while(count < happinessCal){
                pictureToShow.push(<img style={{width: '15%', marginRight: '1%'}} src={Cute} />);
                count++;
              }
              if(checkExist < 0) return (
                <div className="cardContainer" key={key}>
                  <div className="cardPicture">
                    <img src={`${data.imageUrl}`} />
                  </div>
                  <div className="cardDetail">
                    <p>
                      {data.name}
                    </p>
                    <div style={{display: 'flex', justify: 'flex-start', marginBottom: '1vw'}}>
                      <p style={{width:"40%", margin: 0}}>HP</p>
                      <div style={{width: "60%"}}>
                        <div style={{width:`${hpCal}%`, backgroundColor:'red', borderRadius:'20px'}}>
                          &nbsp;
                        </div>
                      </div>
                    </div>
                    <div style={{display: 'flex', justify: 'flex-start', marginBottom: '1vw'}}>
                      <p style={{width:"40%", margin: 0}}>STR</p>
                      <div style={{width: "60%"}}>
                        <div style={{width:`${strCal}%`, backgroundColor:'red', borderRadius:'20px'}}>
                          &nbsp;
                        </div>
                      </div>
                    </div>
                    <div style={{display: 'flex', justify: 'flex-start', marginBottom: '1vw'}}>
                      <p style={{width:"40%", margin: 0}}>WEAK</p>
                      <div style={{width: "60%"}}>
                        <div style={{width:`${weakCal}%`, backgroundColor:'red', borderRadius:'20px'}}>
                          &nbsp;
                        </div>
                      </div>
                    </div>
                    <div style={{display: 'flex', justify: 'flex-start', marginBottom: '1vw'}}>
                      <p style={{width:"40%", margin: 0}}>HAPPINESS</p>
                      <div style={{width: "60%"}}>
                        {pictureToShow}
                      </div>
                    </div>
                  </div>
                  <div className="addPokedex">
                    <p style={{margin: `0 0 0 5%`, cursor: `pointer`}} onClick={()=>{this.addToPokedex(data)}}>
                        Add
                    </p>
                  </div>

                </div>
              )}
            )}
          </div>
        </div>
      </div>

    )
  }

  render() {
    let { allCard, modalShow } = this.state;
    return (
      <div className="App">
        <div className="container">

          <div className="content">
            <div className="title">
              <p>
                My Pokedex
              </p>
            </div>
            <div className="myPokedex">
              {this.renderMyPokedex()}
            </div>
          </div>


          {
            modalShow && <div className="searchPokedex">
              {this.renderSearchPokedex()}
            </div>
          }



          <div className="addSection">
            <div className="addButtonSection">
              <p className="addButtonSection text" onClick={this.onModalClick}>
                +
              </p>
            </div>
          </div>




        </div>
      </div>
    )
  }
}

export default App
