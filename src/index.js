import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


/* originalmente, Square era una clase:
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={ () =>  this.props.onClick() }>
        {this.props.value}
      </button>
    );
  }
}*/

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {

  renderSquare(i) {
    // el () después de retuen es para que JS no inserte un ; despues del return (esto rompería el código)
    // creo un Square con el valor que paso por i (esto en cada cuadrado). Luego en el que hago click, actualizo su valor siguiendo la fx handlClick()
    return (
      <Square value={this.props.squares[i]}
              onClick={ () => this.props.onClick(i)}/>
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      pasoNumero: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.pasoNumero + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      pasoNumero: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(paso) {
    this.setState({
      pasoNumero: paso,
      xIsNext: (paso % 2) === 0,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.pasoNumero];
    const winner = calculateWinner(current.squares);

    const moves = history.map((paso, movimiento) => {     
      const desc = movimiento ?
        'Ir al paso número ' + movimiento : 'Ir al inicio del juego';
        return (
          <li key={movimiento}>
            <button onClick={() => this.jumpTo(movimiento)}>{desc}</button>
          </li>
        )
    })

    let status;
    if (winner) {
      status = 'El ganador es ' + winner;
    } else {
      status = 'Próximo jugador: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={ i => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

