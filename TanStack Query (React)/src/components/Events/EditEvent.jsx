import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

import { queryClient } from '../../util/http.js';
import { fetchEvent, updateEvent } from '../../util/http.js';

export default function EditEvent() {
  const navigate = useNavigate();
  const params = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['event-details', params.id],
    queryFn: ({signal}) => fetchEvent({id: params.id, signal})
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const newEvent = data.event;

      await queryClient.cancelQueries({queryKey: ['event-details', params.id]});

      const previousData = queryClient.getQueryData(['event-details', params.id]);

      queryClient.setQueryData(['event-details', params.id], newEvent);

      return {previousData}
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(['event-details', params.id], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['events-details', params.id]);
    }
  })

  function handleSubmit(formData) {
    mutate({id: params.id, event: formData})
    navigate('../');
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  if(isPending){
    content = <div className='center'>
      <LoadingIndicator />     
    </div>
  }

  if(isError){
    content = <div>
      <ErrorBlock title='Error Occured!' message={error.info?.message || 'Failed to fetch event details'}/>
      <div className='form-actions'>
        <Link to="../" className="button">
          Okay
        </Link>
      </div>
    </div>
  }

  if(data){
    content = <EventForm inputData={data} onSubmit={handleSubmit}>
      <Link to="../" className="button-text">
        Cancel
      </Link>
      <button type="submit" className="button">
        Update
      </button>
    </EventForm>
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}
