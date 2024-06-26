import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchEvent } from '../../util/http.js';
import { deleteEvent } from '../../util/http.js';
import { queryClient } from '../../util/http.js';

import Header from '../Header.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import Modal from '../UI/Modal.jsx';

export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isPending, isError, error} = useQuery({
    queryKey: ['event-details', params.id],
    queryFn: ({signal}) => fetchEvent({id: params.id, signal}),
  });

  const { mutate, 
          isPending: pendingDeletion, 
          isError: errorDeletion 
        } = useMutation({
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

  const handleStartDeleting = () => {
    setIsDeleting(true);
  }

  const handleCloseDeleting = () => {
    setIsDeleting(false);
  }

  if(data){
    content = 
    <article id="event-details">
      <header>
        <h1>{data.title}</h1>
        <nav>
          <button onClick={handleStartDeleting}>Delete</button>
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
      {isDeleting &&
        <Modal onClose={handleCloseDeleting}>
          <h2>Are you sure?</h2>
          <p>This action cannot be undone.</p>
          {pendingDeletion && <p className='form-actions'>Deleting event...</p>}

          {!pendingDeletion && 
            <div className='form-actions'>
              <button className='button-text' onClick={handleCloseDeleting}>Cancel</button>
              <button className='button' onClick={handleDeleteEvent}>Delete</button>
            </div>
          }

          {error && <ErrorBlock title='Error Occured!' message={error.info?.message || 'Failed to delete event.'}/>}
          
        </Modal> 
      }
      
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
