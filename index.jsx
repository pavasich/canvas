import React, { Component, PropTypes } from 'react';
import _Canvas from './_Canvas';

/*
    U S A G E

  <Canvas
    id=string,
    width=number,
    height=number,
    lineWidth=number,
    className=string,
    style=objectOf(string),
    diamond_radius=number,
  />
*/

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.image = [];
    this.state = {
      flair: null,
    };
  }

  getCanvasElement() {
    return this.refs.canvas.getElement();
  }

  getImage() {
    return this.refs.canvas.getImage();
  }

  rect({ x, y, width, height, color }) {
    this.image.push(
      { op: 'rect',
        args: { x, y, width, height, color },
      });
  }
  clear({ x, y, width, height }) {
    this.image.push(
      { op: 'clearRect',
        args: { x, y, width, height },
      });
  }
  clearAll() {
    this.refs.canvas.clear();
  }
  triangle({ x1, y1, x2, y2, x3, y3, color }) {
    this.image.push(
      { op: 'triangle',
        args: { x1, y1, x2, y2, x3, y3, color },
      });
  }
  diamond({ x, y, r, color }) {
    this.image.push(
      { op: 'diamond',
        args:
        { x, y, r, color },
      });
  }
  line({ x1, y1, x2, y2, color }) {
    this.image.push(
      { op: 'line',
        args:
        { x1, y1, x2, color,
          y2: y2 || y1,
        },
      });
  }
  lineDash({ x1, y1, x2, y2, color }) {
    this.image.push(
      { op: 'lineDash',
        args:
        { x1, y1, x2, y2, color },
      });
  }
  equationLine({ x1, y1, x2, func, iters, color }) {
    this.image.push(
      { op: 'equationLine',
        args:
        { x1, y1, x2, func, iters, color },
      });
  }
  equationFill({ x1, y1, x2, func, iters, color }) {
    this.image.push(
      { op: 'equationFill',
        args:
        { x1, y1, x2, func, iters, color },
      });
  }
  distribution({ x1, y1, x2, points, scale, color }) {
    this.image.push(
      { op: 'distribution',
        args:
        { x1, y1, x2, points, scale, color },
      });
  }
  text({ x, y, color, text, font }) {
    this.image.push(
      { op: 'text',
        args: { x, y, color, text, font },
      });
  }

  passFlair(flair) {
    this.setState({ flair });
  }

  update() {
    this.refs.canvas.update();
  }

  render() {
    let jsx = (
      <_Canvas
        {...this.props}
        image={this.image}
        ref="canvas"
      />
    );

    if (this.props.style) {
      return (
        <div style={this.props.style}>
          {jsx}
          {this.state.flair}
        </div>
      );
    }
    return (
      <div className={this.props.className}>
        {jsx}
        {this.state.flair}
      </div>
    );
  }
}

Canvas.propTypes = {
  id: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  lineWidth: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.string),
  diamond_radius: PropTypes.number,
};

export default Canvas;
