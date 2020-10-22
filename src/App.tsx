import React, {FC} from 'react';
import Canvas from "./components/Canvas";
import "./css/App.css"


const App: FC<any> = () =>  {
  return <div>
    <div>React <span>Simple</span> Whiteboard</div>
    <Canvas />
  </div>;
}

export default App;
