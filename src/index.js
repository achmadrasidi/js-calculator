import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const isOperator = /[x/+‑]/;
const endsWithOperator = /[x+‑/]$/;
const endsWithNegativeSign = /\d[x/+‑]{1}‑$/;

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVal: "0",
      prevVal: "0",
      formula: "",
      currentSign: "pos",
      lastClicked: "",
    };
    this.maxDigitsWarning = this.maxDigitsWarning.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.initialize = this.initialize.bind(this);
    this.handleDecimals = this.handleDecimals.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
  }

  maxDigitsWarning() {
    this.setState({
      currentVal: "Limit Digit Exceeded",
      prevVal: this.state.currentVal,
    });
    setTimeout(() => this.setState({ currentVal: this.state.prevVal }), 1000);
  }

  handleOperators(e) {
    if (!this.state.currentVal.includes("Limit")) {
      const value = e.target.value;
      const { formula, prevVal, evaluated } = this.state;
      this.setState({ currentVal: value, evaluated: false });
      if (evaluated) {
        this.setState({ formula: prevVal + value });
      } else if (!endsWithOperator.test(formula)) {
        this.setState({ prevVal: formula, formula: formula + value });
      } else if (!endsWithNegativeSign.test(formula + value)) {
        this.setState({ formula: (endsWithNegativeSign.test(formula + value) ? formula : prevVal) + value });
      } else if (value !== "-") {
        this.setState({
          formula: prevVal + value,
        });
      }
    }
  }

  handleEvaluate() {
    if (!this.state.currentVal.includes("Limit")) {
      let express = this.state.formula;
      while (endsWithOperator.test(express)) {
        express = express.slice(0, -1);
      }
      express = express.replace(/x/g, "*").replace(/‑/g, "-").replace("--", "+0+0+0+0+0+0+");
      let answer = Math.round(1000000000000 * eval(express)) / 1000000000000;
      this.setState({
        currentVal: answer.toString(),
        formula:
          express
            .replace(/\*/g, "⋅")
            .replace(/-/g, "‑")
            .replace("+0+0+0+0+0+0+", "‑-")
            .replace(/(x|\/|\+)‑/, "$1-")
            .replace(/^‑/, "-") +
          "=" +
          answer,
        prevVal: answer,
        evaluated: true,
      });
    }
  }

  initialize() {
    this.setState({
      currentVal: "0",
      prevVal: "0",
      formula: "",
      currentSign: "pos",
      lastClicked: "",
      evaluated: false,
    });
  }

  handleDecimals() {
    if (this.state.evaluated === "true") {
      this.setState({
        currentVal: "0.",
        formula: "0.",
        evaluated: false,
      });
    } else if (!this.state.currentVal.includes("Limit") && !this.state.currentVal.includes("Limit")) {
      this.setState({ evaluated: false });
      if (this.state.currentVal.length > 21) {
        this.maxDigitsWarning();
      } else if (endsWithOperator.test(this.state.formula) || (this.state.currentVal === "0" && this.state.formula === "")) {
        this.setState({
          currentVal: "0",
          formula: this.state.formula + "0.",
        });
      } else {
        this.setState({
          currentVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + ".",
          formula: this.state.formula + ".",
        });
      }
    }
  }

  handleNumbers(e) {
    if (!this.state.currentVal.includes("Limit")) {
      const value = e.target.value;
      const { currentVal, formula, evaluated } = this.state;

      this.setState({
        evaluated: false,
      });
      if (currentVal.length > 21) {
        this.maxDigitsWarning();
      } else if (evaluated) {
        this.setState({
          currentVal: value,
          formula: value !== "0" ? value : "",
        });
      } else {
        this.setState({
          currentVal: currentVal === "0" || isOperator.test(currentVal) ? value : currentVal + value,
          formula: currentVal === "0" && value === "0" ? (formula = "" ? value : formula) : /([^.0-9]0|^0)$/.test(formula) ? formula.slice(0, -1) + value : formula + value,
        });
      }
    }
  }

  render() {
    return (
      <div className="wrapper">
        <div className="display" id="display">
          ({this.state.prevVal})<span>{this.state.currentVal}</span>{" "}
        </div>
        <Buttons decimal={this.handleDecimals} evaluate={this.handleEvaluate} initialize={this.initialize} numbers={this.handleNumbers} operators={this.handleOperators} />
      </div>
    );
  }
}

class Buttons extends React.Component {
  render() {
    return (
      <div className="subButton">
        <button id="clear" onClick={this.props.initialize} value="AC">
          AC
        </button>
        <button id="plusmin">+-</button>
        <button id="percent">%</button>
        <button id="divide" onClick={this.props.operators} value="/">
          /
        </button>
        <button id="seven" onClick={this.props.numbers} value="7">
          7
        </button>
        <button id="eigth" onClick={this.props.numbers} value="8">
          8
        </button>
        <button id="nine" onClick={this.props.numbers} value="9">
          9
        </button>
        <button id="multiply" onClick={this.props.operators} value="*">
          *
        </button>
        <button id="four" onClick={this.props.numbers} value="4">
          4
        </button>
        <button id="five" onClick={this.props.numbers} value="5">
          5
        </button>
        <button id="six" onClick={this.props.numbers} value="6">
          6
        </button>
        <button id="substract" onClick={this.props.operators} value="-">
          -
        </button>

        <button id="one" onClick={this.props.numbers} value="1">
          1
        </button>
        <button id="two" onClick={this.props.numbers} value="2">
          2
        </button>
        <button id="three" onClick={this.props.numbers} value="3">
          3
        </button>
        <button id="add" onClick={this.props.operators} value="+">
          +
        </button>

        <button id="zero" onClick={this.props.numbers} value="0">
          0
        </button>
        <button id="decimal" onClick={this.props.decimal} value=".">
          .
        </button>
        <button className="equals" id="equals" onClick={this.props.evaluate} value="=">
          =
        </button>
      </div>
    );
  }
}
ReactDOM.render(
  <React.StrictMode>
    <Calculator />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
