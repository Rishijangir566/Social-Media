import { useEffect, useState } from 'react';
import instance from '../axiosConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Notifications({ userData, availableUser, setUserData }) {
  const [senders, setSenders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSenderIDs() {
      try {
        const senderData = await instance.get(`/api/users/request/${requestId}`);
            console.log(senderData)
           
       
        filterAvailableUsers(senderData);
      } catch (error) {
        console.error('Error fetching sender IDs:', error);
      }
    }
fetchSenderIDs()
   
  }, []);

  async function acceptRequest(requestId) {
    try {
      const response = await instance.put(`/api/users/accept/${requestId}`);
   console.log("hello3")
      if (response?.status === 200 && response?.data) {
        toast.success("Friend Request Accepted!", { position: "top-right", autoClose: 3000 });

        setUserData((prev) => ({
          ...prev,
          receivedRequest: prev.receivedRequest.filter(id => id !== requestId),
        }));

        setSenders(prev => prev.filter(sender => sender.friendRequestId !== requestId));

        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.warn(`Unexpected response: ${response.status}`);
      }

    } catch (error) {
      toast.error("Error accepting request!");
      console.error("Accept error:", error);
    }
  }

  async function rejectRequest(requestId) {
    try {
      const response = await instance.put(`/api/users/reject/${requestId}`);
             console.log("hello")
      if (response?.status === 200 && response?.data) {
        toast.success("Friend Request Rejected!", { position: "top-right", autoClose: 3000 });

        setUserData((prev) => ({
          ...prev,
          receivedRequest: prev.receivedRequest.filter(id => id !== requestId),
        }));

        setSenders(prev => prev.filter(sender => sender.friendRequestId !== requestId));

        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.warn(`Unexpected response: ${response.status}`);
      }

    } catch (error) {
      toast.error("Failed to reject friend request!");
      console.error("Reject error:", error);
    }
  }

  return (
    <div>
      <h2>Notifications</h2>
      {senders.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {senders.map(sender => (
            <li key={sender._id}>
              {sender.name} sent you a request.
              <button onClick={() => acceptRequest(sender.friendRequestId)}>Accept</button>
              <button onClick={() => rejectRequest(sender.friendRequestId)}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
