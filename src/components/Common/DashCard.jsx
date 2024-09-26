import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useNavigate } from "react-router";

const useStyles = makeStyles(() => ({
    root: {
       
        cursor: "pointer",
        borderRadius:'5px',
    },
    icon: {
        height: '2.5rem',
        width: '2.5rem',
        margin: '1rem',
    },
    title: {
        fontSize: '0.9rem',
        fontWeight:'bold'
    },
    count: {
        fontSize: '1.5rem',
        fontWeight:'bold'
    },
    view: {
        fontSize: '0.8rem',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        gap:'5px',
        marginBottom:'-10px',
        
    }
}));




const DashCard = (cardProps) => {
    const classes = useStyles();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(cardProps?.url)
    }
    return (
        <Card className={classes.root} style={{background: '#FFFFFF'}} onClick={() => handleClick()}>
            <CardContent>
                <Grid container display={'flex'} justifyContent="space-between" alignItems={'center'}>
                    <Grid item>
                        <img src={cardProps.img} alt={''} className={classes.icon}/>
                    </Grid>
                    <Grid item>
                       <Box className={classes.title}>
                            {cardProps?.title}
                       </Box>
                       <Box className={classes.count} display={'flex'} justifyContent={'flex-end'}>
                            {cardProps?.count}
                       </Box>
                    </Grid>
                </Grid>
                <Box className={classes.view}><img style={{ maxHeight:'15px'}} src={cardProps?.viewImg} alt='label'/>{cardProps?.view}</Box>
            </CardContent>
        </Card>
    );
};
export default DashCard;
