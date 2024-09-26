import { Box, Card, CardContent, Typography } from '@mui/material'
import React from 'react'

const EachSurvey = () => {
  return (
    <>
     <Card>
        <CardContent style={{padding:'15px 30px'}}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography color={'primary'} fontSize={'20px'} fontWeight={'bold'}>
                Abu Dhabi Intake24
                </Typography>
                <Box textAlign={'center'} >
                    <Typography style={{'color':'#1D2420',fontWeight:'bold'}} fontSize={'16px'}>
                    Number of households
                    </Typography>
                    <Typography style={{'color':'#1D2420',fontWeight:'bold'}} fontSize={'20px'}>
                    128
                    </Typography>
                </Box>
            </Box>
        </CardContent>        
     </Card>
    </>
  )
}

export default EachSurvey