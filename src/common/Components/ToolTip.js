import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  customWidth: {
    maxWidth: 500,
  },
  noMaxWidth: {
    maxWidth: 'none',
  },
}));



export default function VariableWidth(props) {
  return (
    <div className='center flex justify-center align-center'>
      <Tooltip TransitionComponent={Zoom} title={props.innertext} arrow >
        {props.children}
      </Tooltip>
      
    </div>
  );
}
