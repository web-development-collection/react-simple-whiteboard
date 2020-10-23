import React, {Component, ReactNode} from 'react';


interface ExtendedHTMLCanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}




export class Canvas extends Component<any, any> {
  private refCanvas = React.createRef<ExtendedHTMLCanvasElement>();
  private prevCoords: [number, number] = [0, 0];

  private mediaSource = new MediaSource();
  private recordedBlobs: any;
  private sourceBuffer: any;
  private mediaRecorder: any;
  private stream: any;


  private get canvas(): ExtendedHTMLCanvasElement {
    return this.refCanvas.current!;
  }


  public componentDidMount() {
    this.handlePen();
    this.handleRecording();
  }

  // Drawing
  private handlePen() {
    const {clientHeight, clientWidth} = this.canvas;

    const dpi = window.devicePixelRatio;

    this.canvas.height = clientHeight * dpi;
    this.canvas.width = clientWidth * dpi;

    const context = this.canvas.getContext("2d")!;
    context!.scale(dpi, dpi);

    context.beginPath();
    context.rect(0, 0, clientWidth, clientHeight);
    context.fillStyle = "#f1f1f1";
    context.fill();
    context.closePath();


    const onPenMove = (x: number, y: number, force: number = 2) => {
      const [prevX, prevY] = this.prevCoords;

      context.beginPath();
      context.moveTo(prevX, prevY);
      // context.quadraticCurveTo(x, y, y, x);
      // context.lineTo(x, y);

      // Circle
      context.beginPath();
      context.rect(x, y, force * 5, force * 5);
      context.fillStyle = "red";
      context.fill();


      context.strokeStyle = "#000000";
      context.lineWidth = force;
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

      const touch = event.touches[0];
      console.log(touch.force);

      const x = touch.clientX - this.canvas.offsetLeft;
      const y = touch.clientY - this.canvas.offsetTop;
      onPenMove(x, y, 10 * touch.force);
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

  // Recording
  private handleRecording() {
    this.stream = (this.canvas as any)?.captureStream();
    console.log('Started stream capture from canvas element: ', this.stream);

    this.mediaSource.addEventListener('sourceopen', () => {
      console.log('MediaSource opened');
      this.sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
      console.log('Source buffer: ', this.sourceBuffer);
    });
  }

  public startRecording() {
    console.log("Started Recording");

    const onDataAvailable = (event: any) => {
      if (event.data && event.data.size > 0) {
        this.recordedBlobs.push(event.data);
      }
    }

    const onStop = (event: any) => {
      console.log('Recorder stopped: ', event);
      const blob = new Blob(this.recordedBlobs, {type: 'video/webm'});
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'test.webm';
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
      }, 100);
    }


    let options = {
      audio: true,
      mimeType: 'video/webm'
    };
    this.recordedBlobs = [];
    try {
      this.mediaRecorder = new MediaRecorder(this.stream, options);
    }
    catch (e0) {
      console.log('Unable to create MediaRecorder with options Object: ', e0);
      try {
        options = {
          audio: true,
          mimeType: 'video/webm,codecs=vp9'
        };
        this.mediaRecorder = new MediaRecorder(this.stream, options);
      }
      catch (e1) {
        console.log('Unable to create MediaRecorder with options Object: ', e1);
        try {
          // @ts-ignore
          options = {
            audio: true,
            mimeType: 'video/vp8',
          }; // Chrome 47
          this.mediaRecorder = new MediaRecorder(this.stream, options);
        }
        catch (e2) {
          alert('MediaRecorder is not supported by this browser.\n\n' +
            'Try Firefox 29 or later, or Chrome 47 or later, ' +
            'with Enable experimental Web Platform features enabled from chrome://flags.');
          console.error('Exception while creating MediaRecorder:', e2);
          return;
        }
      }
    }
    console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);
    this.mediaRecorder.onstop = onStop;
    this.mediaRecorder.ondataavailable = onDataAvailable;
    this.mediaRecorder.start(100); // collect 100ms of data
    console.log('MediaRecorder started', this.mediaRecorder);

  }

  public stopRecording() {
    this.mediaRecorder.stop();
  }


  public render(): ReactNode {
    return <canvas
      className="Canvas"
      ref={this.refCanvas}
    />;
  }
}

export default Canvas;