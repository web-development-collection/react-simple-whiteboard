import React, {FC, useState} from 'react';


interface OwnProps {
  value: string,
  position: [number, number], // x, y
}


export const CanvasTextItem: FC<OwnProps> = ({position = [0, 0], ...props}) => {
  const [value, setValue] = useState(props.value);


  // Render
  const positionStyle = {
    left: position[0],
    top: position[1],
  }

  return <div style={positionStyle} className="text-item">
    <textarea
      onChange={e => setValue(e.target.value)}
      value={value}
    />
  </div>;
};

export default CanvasTextItem;
