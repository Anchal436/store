import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function BasicPagination(props) {
  const classes = useStyles();
  const [currentPage, setcurrentPage] = useState(1);
  const [pageCount, setpageCount] = useState(1);
  useEffect(() => {
    const { pageCount, currentPage } = props;
    setcurrentPage(currentPage);
    setpageCount(pageCount);
  }, [props.currentPage]);
  useEffect(() => {
    setcurrentPage(props.currentPage);
    setpageCount(props.pageCount);
  }, [props.pageCount]);
  const handleChange = (event, value) => {
    if (value !== currentPage) {
      props.onPageChange(value);
    }
  };

  return (
    <div className={classes.root}>

      <Pagination count={pageCount} page={currentPage} onChange={handleChange} color="primary" />

    </div>
  );
}
