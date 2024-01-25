import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Button, Stack, ListGroup, Badge
} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';
// import styles from './App.module.css';
const listStyle = {
  listStyle: 'none', // This removes the list-style
  padding: 0,        // Optional: Remove default padding
};
const listItemStyle = {
  fontSize: '20px', // Set the font size
  padding: '10px',    // Set padding
  marginRight: '6px',
};
// import axios from 'axios';
const YOUTUBE_LIVE_CHAT_URI = 'https://youtube-live-chat-backend.onrender.com/api/live_chat';
const LIVE_CHAT_FETCHING_INTERVAL = 1000 * 10; // 10 seconds
// const JSONPLACEHOLDER = 'https://jsonplaceholder.typicode.com/todos/1';
function App() {
  const [youtubeLiveChat, setYoutubeLiveChat] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');
  const [intevalId, setIntervalId] = useState(0);
  useEffect(() => {
    const fetchYoutubeLiveChat = () => {
      fetch(YOUTUBE_LIVE_CHAT_URI)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error when fetching youtube live chat');
        }
        return response.json()
      })
      .then(data => {
        // let alreadyFetched = false;
        // for (const item in youtubeLiveChat) {
        //   if (item.comment === data.comment)
        //   alreadyFetched = true
        // }
        // if (alreadyFetched === false)
        //   setYoutubeLiveChat([...youtubeLiveChat, data])
        setYoutubeLiveChat([data, ...youtubeLiveChat])
      })
      .catch(error => {
        setError('Error when fetching youtube live chat');
      });
    }
    const returnedId = setInterval(
      fetchYoutubeLiveChat, 
      LIVE_CHAT_FETCHING_INTERVAL);
    setIntervalId(returnedId);
  }, [isFetching, youtubeLiveChat])
  const handleFetchingYoutubeLiveChat = (event) => {
    setIsFetching(true);
    setError('');
  };
  const handleVideoIdInputChange = (event) => {
    setVideoId(event.target.value);
  }
  const handleStopFetchingYoutubeLiveChat = (event) => {
    clearInterval(intevalId);
    setIntervalId(0);
    setIsFetching(false);
    setYoutubeLiveChat([]);
  };
  return (
    <Container fluid="xxl" style={{paddingTop: '60px'}}>
      <h2 className="text-center">
        Theo dõi cảm xúc từ bình luận trực tuyến
      </h2>
      <Row className="justify-content-center align-items-center mt-3">
        <Col className="text-center">
          <Stack gap={3}>
          <label for='video-id-input'>Stream ID</label>
          <input 
            name='video-id-input'
            onChange={handleVideoIdInputChange}
            value={videoId}
            placeholder='Stream ID'
            className="mx-auto"
            />
          </Stack>
        </Col>
        <Col className="text-center">
          <Stack gap={3}>
            <Button 
              onClick={handleFetchingYoutubeLiveChat}
              variant='primary'
              className="mx-auto"
            >
              Theo dõi
            </Button>
            <Button
              onClick={handleStopFetchingYoutubeLiveChat}
              className="mx-auto"
              variant="warning"
            >
              Huỷ theo dõi
            </Button>
          </Stack>
        </Col>
      </Row>
      {!isFetching && 
        <Stack gap={0} style={{marginTop: '20px'}}>
          <p className="text-center">
            Nhấn nút theo dõi để theo dõi bình luận
          </p>
          <p className="text-center">
            Nhấn nút huỷ theo dõi để dừng theo dõi
          </p>
        </Stack>
      }
      {isFetching && <p className="text-center">Đang theo dõi bình luận</p>}
      {error.length > 0 ? (
        <p className='text-center'>Đã xảy ra lỗi, vui lòng thử lại</p>
      ): (
        <p className="text-center">Danh sách bình luận</p>
      )}
      {youtubeLiveChat.length === 0 ? (
        <p className="text-center">Chưa có bình luận mới</p>
      ) : (
        <ListGroup style={listStyle}>
          {youtubeLiveChat.map((item, index) => (
            <ListGroup.Item
              style={listItemStyle}
              className="mx-auto"
            >
              {/* <Badge bg="info" style={{marginRight: '6px'}}>
                {JSON.stringify(item)}
              </Badge> */}
              <Badge bg="info" style={{marginRight: '6px'}}>
                {item.datetime}
              </Badge>
              <Badge bg="secondary" style={{marginRight: '6px'}}>
                Tác giả: {item.authorName}
              </Badge>
              <Badge bg="primary" style={{marginRight: '6px'}}>
                {item.comment}
              </Badge>
              <Badge bg="success">
                {item.feeling}
              </Badge>
            </ListGroup.Item>
          ))}
          </ListGroup>
      )}
    </Container>
  );
}

export default App;
