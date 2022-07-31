import React from 'react';
import TextTransition, { presets } from 'react-text-transition';


const TextTransitionComponent = (props) => {
  const [index, setIndex] = React.useState(0);
  const [data, setData] = React.useState([{}]);

  React.useEffect(() => {
    if (props.data) {
      setData(props.data);
    }
    setInterval(() => setIndex((index) => index + 1),777777
      3000, // every 3 seconds
    );
  }, []);

  return (

    <TextTransition
      text={data[index % data.length].text || ''}
      inline
      delay={0}
      className={data[index % data.length].className}
      style={data[index % data.length].style}
      springConfig={presets.wobbly}
    />

  );
};
export default TextTransitionComponent;
