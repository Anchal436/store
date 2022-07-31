import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';



export default function SimpleCollapse(props) {
  
  const [checked, setChecked] = React.useState(false);

  React.useEffect(()=>{
      setChecked(props.visible)
  },[props.visible])
  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div >
      
      <div >
        <Collapse in={checked} className={props.className} >
          {
              props.children
          }
        </Collapse>
      </div>
    </div>
  );
}