import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchEvent } from '../../util/http.js';
import { deleteEvent } from '../../util/http.js';
import { queryClient } from '../../util/http.js';

import Header from '../Header.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError, error} = useQuery({
    queryKey: ['event-details', {id: params.id}],
    queryFn: ({signal}) => fetchEvent({id: params.id, signal}),
  });

  const { mutate } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none'
      })
      navigate('/events')
    },
  })

  let content;

  if(isPending){  
    content = <div id='event-details-content' className='center'>
      <p>Getting event details...</p>
    </div>
  }

  if(isError){  
    content = <ErrorBlock title='Error Occured!' message={error.info?.message || 'Could not get event details'}/>
  }

  const handleDeleteEvent = () => {
    mutate({id: params.id})
  }

  if(data){
    content = 
    <article id="event-details">
      <header>
        <h1>{data.title}</h1>
        <nav>
          <button onClick={handleDeleteEvent}>Delete</button>
          <Link to="edit">Edit</Link>
        </nav>
      </header>
      <div id="event-details-content">
        <img src={`http://localhost:3000/${data.image}`} alt="" />
        <div id="event-details-info">
          <div>
            <p id="event-details-location">{data.location}</p>
            <time dateTime={`Todo-DateT$Todo-Time`}>{data.time}</time>
          </div>
          <p id="event-details-description">{data.description}</p>
        </div>
      </div>
    </article>
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {content}
    </>
  );
}
