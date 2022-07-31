import React from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Copyright ©
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? '#B3C7D6FF' : '#B3C7D6FF',
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
    backgroundColor: '#',
    color: 'white',
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

export default function Pricing(props) {

  const [pricing, setPricing] = React.useState([
    {
      title: 'Pro',
      price: '600',
      description: [
      ],
      buttonText: 'Get started',
      buttonVariant: 'contained',
    },
    {
      title: 'Free',
      price: '0',
      description: [],
      buttonText: 'Sign up for free',
      buttonVariant: 'outlined',
    },

  ]);
  React.useEffect(() => {
    const tempfreeDescreption = [];
    const tempproDescreption = [];
    const tempPricing = pricing;
    props.pricing.forEach((price) => {
      const freeData = {
        heading: price.heading,
        features: [],
      };
      const proData = {
        heading: price.heading,
        features: [],
      };
      price.features.forEach((feature) => {
        if (feature.regular !== null) {
          freeData.features.push(feature);
        }
        if (feature.pro != null) {
          proData.features.push(feature);
        }
      });
      if (freeData.features.length > 0) {
        tempfreeDescreption.push(freeData);
      }
      if (proData.features.length > 0) {
        tempproDescreption.push(proData);
      }
    });
    tempPricing[0].description = tempproDescreption;
    tempPricing[1].description = tempfreeDescreption;
    setPricing(tempPricing);
  }, [props.pricing]);
  
  return (
    <>
            {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {pricing.map((price) => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={price.title} xs={12} sm={price.title === 'Enterprise' ? 12 : 6} md={4}>
              <Card>
                <CardHeader
                  title={price.title}
                  subheader={`₹${price.price}`}
                  titleTypographyProps={{ align: 'center' }}
                  
                  subheaderTypographyProps={{ align: 'center',color:'white' }}
                  action={price.title === 'Pro' ? <StarIcon /> : null}
                  className={'div-1 white'}
                />
                <CardContent>
                  
                  <ul>
                    {price.description.map((feature) => (
                      <div>
                        
                        {
                            feature.features.map((f) => (
                              <Typography component="li" variant="subtitle1" align="center" key={f} className="bb">
                                {f.featureName}
                              </Typography>
                            ))
                        }

                      </div>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button fullWidth variant={price.buttonVariant} color="primary">
                    {price.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
    </>
  );
}
