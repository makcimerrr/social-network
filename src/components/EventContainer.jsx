import React from 'react';
import { Button, Card, CardContent, CardActions, Typography } from '@mui/material';
import { useRouter } from 'next/router';



const EventContainer = ({ events, handleEventLike }) => {
  const router = useRouter();

  return (
    <div>
      <h2>Events</h2>
      {events && (
        <ul>
          {events.map(event => (
            <li key={event.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {event.content}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Posted by{' '}
                    <Typography variant="body2" color="primary" component="a" onClick={() => router.push(`/user?id=${event.user_id}`)}>
                    User ID: {event.user_id}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Date: {event.date}
                  </Typography>
                  <CardActions>
                  <Button
                      variant="contained"
                      onClick={() => handleEventLike(event.id)}
                    >
                      GO
                    </Button>
                  </CardActions>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Coming: {event.likes}
                  </Typography>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventContainer;