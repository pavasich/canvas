import React, { Component, PropTypes } from 'react';
import { colors } from './config';

/*
        U S A G E
    <_Canvas
      asImage={boolean, render as image or canvas?}
      id=(id for canvas element)
    	image=[array of shapes to draw]
      width=(in pixels)
      height=(in pixels)
      lineWidth=(in pixels, optional)
    />
*/

class _Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: false,
    };
  }

  componentDidMount() {
    this._canvas = this.refs.this;
    this._canvas.id = this.props.id;
    this._context = this._canvas.getContext('2d');
    this.image = '';
    this.refs.img.style.display = 'none';

    this.getElement = this.getElement.bind(this);

    // Always do high dpi / "retina" by default
    this.ratio = 2;

    // when the page is in rendered as print media,
    // run this listener.
    window.matchMedia('print').addListener(media => {
      this.ratio = 2;
      if (media.matches) this.ratio = 4;
      this.updateForPrint.bind(this)();
    });

    this.configureCanvas();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.image.length !== nextProps.image.length ||
           this.props.width !== nextProps.width ||
           this.props.height !== nextProps.height ||
           this.props.lineWidth !== nextProps.lineWidth ||
           this.state.image;
  }

  getElement() {
    return this._canvas;
  }

  getImage() {
    return this._canvas.toDataURL('image/png', 1.0);
  }

  drawImage() {
    this.props.image.map(cmd => {
      this.draw(cmd);
    });
  }

  configureCanvas() {
    const width = this.props.width * this.ratio;
    const height = this.props.height * this.ratio;
    this._canvas.width = width;
    this._canvas.height = height;
    this._canvas.style.width = `${this.props.width}px`;
    this._canvas.style.height = `${this.props.height}px`;
    this._context.scale(this.ratio, this.ratio);
    this._context.fillStyle = 'white';
    this._context.fillRect(0, 0, this.props.width, this.props.height);
  }

  update() {
    this.configureCanvas();
    this.drawImage();
    this.refs.img.src = this._canvas.toDataURL('image/png', 1.0);
  }

  updateForPrint() {
    this.update();
    this._canvas.style.display = 'none';
    this.refs.img.style.display = 'block';
  }

  clear() {
    this._context.clearRect(0, 0, this.props.width, this.props.height);
  }

  draw(cmd) {
    const color = colors[cmd.args.color] || cmd.args.color;
    switch (cmd.op) {
      case 'rect':
        this.holdStyle('fillStyle', color, this.rect(), cmd.args);
        break;
      case 'diamond':
        this.holdStyle('fillStyle', color, this.diamond(), cmd.args);
        break;
      case 'triangle':
        this.holdStyle('fillStyle', color, this.triangle(), cmd.args);
        break;
      case 'line':
        this.holdStyle('strokeStyle', color, this.line(), cmd.args);
        break;
      case 'lineDash':
        this.holdStyle('strokeStyle', color, this.lineDash(), cmd.args);
        break;
      case 'equationLine':
        this.holdStyle('strokeStyle', color, this.equationLine(), cmd.args);
        break;
      case 'equationFill':
        this.holdStyle('fillStyle', color, this.equationFill(), cmd.args);
        break;
      case 'distribution':
        this.holdStyle('fillStyle', color, this.distribution(), cmd.args);
        break;
      case 'clearRect':
        this.holdStyle('fillStyle', null, this.clearRect(), cmd.args);
        break;
      case 'text':
        this.holdStyle('fillStyle', color, this.text(), cmd.args);
        break;
      default:
        break;
    }
  }

  holdStyle(style, color, func, args) {
    this._context.save();
    this._context[style] = color;
    func(args);
    this._context.restore();
  }

  rect() {
    return ({ x, y, width, height }) => {
      this._context.fillRect(x, y, width, height);
    };
  }

  diamond() {
    return ({ x, y, r }) => {
      this._context.beginPath();
      this._context.moveTo(x, y - r);
      this._context.lineTo(x + r, y);
      this._context.lineTo(x, y + r);
      this._context.lineTo(x - r, y);
      this._context.closePath();
      this._context.fill();
    };
  }

  triangle() {
    return ({ x1, y1, x2, y2, x3, y3 }) => {
      this._context.beginPath();
      this._context.moveTo(x1, y1);
      this._context.lineTo(x2, y2);
      this._context.lineTo(x3, y3);
      this._context.closePath();
      this._context.fill();
    };
  }

  line() {
    return ({ x1, y1, x2, y2 }) => {
      this._context.lineWidth = this.props.lineWidth;
      this._context.beginPath();
      this._context.moveTo(x1, y1);
      this._context.lineTo(x2, y2);
      this._context.stroke();
    };
  }

  lineDash() {
    return ({ x1, y1, x2, y2 }) => {
      this._context.lineWidth = 2;
      this._context.setLineDash([3, 3]);
      this._context.beginPath();
      this._context.moveTo(x1, y1);
      this._context.lineTo(x2, y2);
      this._context.stroke();
      this._context.lineWidth = this.props.lineWidth;
    };
  }

  equationLine() {
    return ({ x1, y1, x2, func, iters }) => {
      const step = (x2 - x1) / iters;
      let x = x1;
      this._context.beginPath();
      this._context.moveTo(x1, y1);
      while (x <= x2) {
        this._context.lineTo(x, func(x) + y1);
        x += step;
      }
      this._context.stroke();
    };
  }

  equationFill() {
    return ({ x1, y1, x2, func, iters }) => {
      const step = (x2 - x1) / iters;
      let x = x1;
      this._context.beginPath();
      this._context.moveTo(x1, func(x) + y1);
      while (x <= x2) {
        this._context.lineTo(x, func(x) + y1);
        x += step;
      }
      this._context.closePath();
      this._context.fill();
    };
  }

  distribution() {
    return ({ x1, x2, points, scale }) => {
      const step = (x2 - x1) / points.length;
      let x = x1;
      this._context.beginPath();
      this._context.moveTo(x1, this.props.height);
      for (let i = 0; i < points.length; i++) {
        this._context.lineTo(x, this.props.height - (parseInt(scale(points[i]), 10) || 0));
        x += step;
      }

      this._context.closePath();
      this._context.fill();
    };
  }

  clearRect() {
    return ({ x, y, width, height }) => {
      this._context.clearRect(x, y, width, height);
    };
  }

  text() {
    return ({ x, y, text, font }) => {
      this._context.font = font || '12px Roboto';
      this._context.fillText(text, x, y);
    };
  }

  render() {
    return (
      <span>
        <canvas ref="this" />
        <img
          width={this.props.width}
          height={this.props.height}
          ref="img"
          alt="visualization"
        />
      </span>
    );
  }
}

_Canvas.propTypes = {
  id: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  image: PropTypes.array,
  lineWidth: PropTypes.number,
};

_Canvas.defaultProps = {
  id: '',
  lineWidth: 3,
};

export default _Canvas;
