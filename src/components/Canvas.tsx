import React, {Component, ReactNode} from 'react';



class Canvas extends Component<any, any> {
  private refCanvas = React.createRef<HTMLCanvasElement>();
  private prevCoords: [number, number] = [0, 0];


  private get canvas(): HTMLCanvasElement {
    return this.refCanvas.current!;
  }




  public componentDidMount() {
    const {clientHeight, clientWidth} = this.canvas;

    const dpi = window.devicePixelRatio;

    this.canvas.height = clientHeight * dpi;
    this.canvas.width = clientWidth * dpi;



    const context = this.canvas.getContext("2d")!;
    context!.scale(dpi, dpi);


    const onPenMove = (x: number, y: number) => {
      const [prevX, prevY] = this.prevCoords;

      context.beginPath();
      context.moveTo(prevX, prevY);
      // context.quadraticCurveTo(x, y, y, x);
      context.lineTo(x, y);

      // Circle
      // context.beginPath();
      // context.rect(x, y, 10, 5);
      // context.fillStyle = "red";
      // context.fill();


      context.strokeStyle = "#000000";
      context.lineWidth = 2;
      context.lineCap = "round";
      context.stroke();
      context.closePath();

      this.prevCoords = [x, y];
    }

    const onPenMoveMouse = (event: MouseEvent) => {
      const LEFT_MOUSE_BUTTON = 1;


      if (event.buttons === LEFT_MOUSE_BUTTON) {
        const x = event.clientX - this.canvas.offsetLeft;
        const y = event.clientY - this.canvas.offsetTop;
        onPenMove(x, y);
      }
      else {
        const x = event.clientX - this.canvas.offsetLeft;
        const y = event.clientY - this.canvas.offsetTop;
        this.prevCoords = [x, y];
      }
    }

    const onPenMoveTouch = (event: TouchEvent) => {
      if (event.touches.length <= 0)
        return

      const x = event.touches[0].clientX - this.canvas.offsetLeft;
      const y = event.touches[0].clientY - this.canvas.offsetTop;
      onPenMove(x, y);
    }

    // this.canvas.addEventListener('touchmove', onPenMove);
    this.canvas.addEventListener('mousemove', onPenMoveMouse);
    this.canvas.addEventListener('touchmove', onPenMoveTouch);
    this.canvas.addEventListener('touchstart', (event: TouchEvent) => {
      event.preventDefault();

      if (event.touches.length > 0) {
        const x = event.touches[0].clientX - this.canvas.offsetLeft;
        const y = event.touches[0].clientY - this.canvas.offsetTop;
        this.prevCoords = [x, y];
      }
    });

  }


  public render(): ReactNode {
    return <canvas
      className="Canvas"
      ref={this.refCanvas}
    />;
  }
}

export default Canvas;