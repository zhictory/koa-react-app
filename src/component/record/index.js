import React, { Component } from "react";

import "./style.css";

class Record extends Component {
  constructor(props) {
    super(props);
    const date = new Date();
    this.state = {
      event: "Hello World",
      start: "",
      end: "",
      copySuccess: false
    };
    this.startEveryDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      9,
      0,
      0
    ).getTime();
    this.endEveryDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      18,
      0,
      0
    ).getTime();
  }

  addTODO = e => {
    if (e.charCode === 13) {
      const date = new Date();
      this.setState({
        start: `${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${
          date.getMinutes() < 10 ? "0" : ""
        }${date.getMinutes()}`
      });
    }
  };

  updateTODO = e => {
    this.setState({ event: e.target.value });
  };

  renderTimeBlock(currentBlock) {
    let startEveryDay = this.startEveryDay;
    const endEveryDay = this.endEveryDay;
    let date = new Date(startEveryDay);
    const blocks = [];
    // 生成可选择的时间块
    while (date.getTime() <= endEveryDay) {
      blocks.push(
        `${(date.getHours() < 10 ? "0" : "") +
          date.getHours()}:${(date.getMinutes() < 10 ? "0" : "") +
          date.getMinutes()}`
      );
      startEveryDay += 15 * 60 * 1000;
      date = new Date(startEveryDay);
    }
    return blocks.map((block, index) => (
      <li
        key={index}
        className={
          "time-block" + (block === currentBlock ? " time-block_on" : "")
        }
        onClick={this.handleChooseTime}
        data-block={block}
      >
        {block}
      </li>
    ));
  }

  handleChooseTime = e => {
    const type = e.target.parentNode.getAttribute("data-time");
    const time = e.target.getAttribute("data-block");
    this.setState({
      [type]: time
    });
  };

  copy = content => {
    const input = document.createElement("input");
    input.setAttribute("readonly", "readonly");
    input.setAttribute("value", content);
    document.body.appendChild(input);
    input.select(); // 兼容 pc
    input.setSelectionRange(0, 9999); // 兼容 ios
    if (document.execCommand("copy")) {
      document.execCommand("copy");
      this.setState({ copySuccess: true });
      setTimeout(() => {
        this.setState({ copySuccess: false });
      }, 1000);
    } else {
      this.setState({ copySuccess: false });
    }
    document.body.removeChild(input);
  };

  render() {
    const { event, start, end, copySuccess } = this.state;
    return (
      <div className="app-record">
        <p className="app-record__todo">
          <input
            type="text"
            onChange={this.updateTODO}
            onKeyPress={this.addTODO}
            value={event}
          />
        </p>
        <ul className="time-blocks" data-time="start">
          {this.renderTimeBlock(start)}
        </ul>
        <ul className="time-blocks" data-time="end">
          {this.renderTimeBlock(end)}
        </ul>
        <table className="app-record__table">
          <tbody>
            <tr>
              <td>{event}</td>
              <td>{start}</td>
              <td>{end}</td>
            </tr>
          </tbody>
        </table>
        <div
          className="app-record__copy"
          onClick={this.copy.bind(this, event + " " + start + " " + end)}
        >
          <span role="img" aria-label="check">
            📋
          </span>{" "}
          {copySuccess && (
            <span role="img" aria-label="check">
              ✔️
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default Record;
