import React, {FC, RefObject, useRef, useState} from 'react';
import Canvas from "./components/Canvas";
import "./css/App.css"


const App: FC<any> = () =>  {
  const refCanvas = useRef<Canvas>() as RefObject<Canvas>;
  let [recording, setRecording] = useState(false);

  return <div>
    <div>
      <div>React <span>Simple</span> Whiteboard</div>
      <div><button
        onClick={() => {
          const _recording = !recording;
          setRecording(_recording);

          _recording ?
            refCanvas.current!.startRecording() :
            refCanvas.current!.stopRecording();
        }}
        className="Record">{recording ? "Stop and Download" : "Start Recording"}</button></div>
    </div>
    <Canvas ref={refCanvas} />
  </div>;
}

export default App;
