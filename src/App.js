import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Container from '@mui/material/Container';
import axios from 'axios';
import { Typography } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { styled } from '@mui/material/styles';
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
function retrieveDateRepresentation(datetime_str = '') {
    const dateObject = new Date(datetime_str);
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();
    // const milliseconds = dateObject.getMilliseconds();
    return `${hours}:${minutes}:${seconds}`
}
function checkValidComment(comment='') {
    if (typeof comment !== 'string') return false;
    if (comment.length === 0) return false;
    if (/^[0-9]+$/.test(comment)) return false;
    const words = comment.trim().split(/\s+/);
    if (words.length < 3) return false;
    return true;
}
const App = () => {
    const [consumingYoutubeLiveChat, setConsumingYoutubeLiveChat] = useState(false);
    const isInitialRender = useRef(true);
    const youtubeLiveChatListRef = useRef(null); 
    const [videoId, setVideoId] = useState('Kg_qK8uAaEY');
    const [searchStreamDetails, setSearchStreamDetails] = useState(false);
    const [streamDetails, setStreamDetails] = useState(null);
    const commentIdAlreadyConsumed = useRef([]);
    const [emptyDataResponse, setEmptyDataResponse] = useState(false);
    const totalLiveChatComments = useRef(0);
    const neutralLiveChatComments = useRef(0);
    const positiveLiveChatComments = useRef(0);
    const negativeLiveChatComments = useRef(0);
    const totalLiveChatCommentsRef = useRef(null);
    const neutralLiveChatCommentsRef = useRef(null);
    const positiveLiveChatCommentsRef = useRef(null);
    const negativeLiveChatCommentsRef = useRef(null);
    const socketConnection = useRef(null);
    useEffect(() => {
        if (isInitialRender.current === true) {
            console.log('Nhấn "Theo dõi" để quan sát bình luận');
            isInitialRender.current = false;
            return;
        } 
        if (consumingYoutubeLiveChat === true) {
            const socket = io('http://127.0.0.1:8000');
            socketConnection.current = socket;
            socket.on('connect', () => {
                console.log('Connected to Socket.IO server');
                socket.emit('livechat::consume');
            });
            socket.on('livechat::receive', (data) => {
                data = JSON.parse(data);
                let flag = false;
                if (data.length === 0) {
                    setEmptyDataResponse(true);
                    return;
                }
                for (let commentId in commentIdAlreadyConsumed.current) {
                    if (commentId === data._id) {
                        flag = true;
                        break;
                    }
                }
                if (flag === false) {
                    if (checkValidComment(data.comment) === false) {
                        console.log(`Invalid: ${JSON.stringify(data)}`);
                        return;
                    }
                    console.log(`Valid: ${JSON.stringify(data)}`);
                    totalLiveChatComments.current += 1;
                    const listItem = document.createElement('li');
                    listItem.className = 'smooth-appear youtube-live-chat-list-item';
                    const datetimeSpan = document.createElement('span');
                    datetimeSpan.textContent = retrieveDateRepresentation(data.datetime);
                    datetimeSpan.className = 'youtube-live-chat-list-item__datetime';
                    const colors = ["red", "blue", "green", "orange", "purple", "pink", "brown"];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    const authorNameStrong = document.createElement('strong');
                    authorNameStrong.textContent = data.authorName;
                    authorNameStrong.className = 'youtube-live-chat-list-item__authorName';
                    authorNameStrong.style.color = randomColor;
                    const commentSpan = document.createElement('span');
                    commentSpan.textContent = data.comment;
                    if (data.feeling === 'neutral') {
                        commentSpan.className = 'youtube-live-chat-list-item__feeling-neutral';
                        neutralLiveChatComments.current += 1;
                    } else if (data.feeling === 'positive') {
                        commentSpan.className = 'youtube-live-chat-list-item__feeling-positive';
                        positiveLiveChatComments.current += 1;
                    } else if (data.feeling === 'negative') {
                        commentSpan.className = 'youtube-live-chat-list-item__feeling-negative';
                        negativeLiveChatComments.current += 1;
                    }
                    listItem.appendChild(datetimeSpan);
                    listItem.appendChild(authorNameStrong);
                    listItem.appendChild(commentSpan);
                    // listItem.appendChild(feelingStrong);
                    const youtubeLiveChatListEle = youtubeLiveChatListRef.current;
                    youtubeLiveChatListEle?.insertBefore(listItem, youtubeLiveChatListEle.firstChild);
                    void listItem.offsetWidth;
                    listItem.style.opacity = 1;
                    totalLiveChatCommentsRef.current.textContent = `${totalLiveChatComments.current}`
                    neutralLiveChatCommentsRef.current.textContent = `${neutralLiveChatComments.current}`
                    positiveLiveChatCommentsRef.current.textContent = `${positiveLiveChatComments.current}`
                    negativeLiveChatCommentsRef.current.textContent = `${negativeLiveChatComments.current}`
                    setEmptyDataResponse(false);
                }
            });
            console.log('Tiến hành "Theo dõi" bình luận');
        } else {
            if (socketConnection.current != null) {
                socketConnection.current?.disconnect();
                console.log('Đã dừng "Theo dõi" bình luận');
                const youtubeLiveChatListEle = youtubeLiveChatListRef.current;
                while (youtubeLiveChatListEle.firstChild) {
                    youtubeLiveChatListEle.removeChild(youtubeLiveChatListEle.firstChild);
                }
            }
        }
    }, [consumingYoutubeLiveChat]);
    useEffect(() => {
        totalLiveChatComments.current = 0;
        neutralLiveChatComments.current = 0;
        positiveLiveChatComments.current = 0;
        negativeLiveChatComments.current = 0;
        totalLiveChatCommentsRef.current.textContent = `0`;
        neutralLiveChatCommentsRef.current.textContent = `0`;
        positiveLiveChatCommentsRef.current.textContent = `0`;
        negativeLiveChatCommentsRef.current.textContent = `0`;
        const fetchVideoDetails = async () => {
            try {
                const API_KEY = 'AIzaSyDOurBqX1STSB2zOCKH67RUzt652SaIXC4';
                const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet`
                );
                const videoData = response.data.items[0];
                if (videoData !== undefined) {
                    setStreamDetails({
                        'channelTitle': videoData['snippet']['channelTitle'],
                        'title': videoData['snippet']['title'],     
                        'description':  videoData['snippet']['description'],       
                    });
                }
            } catch (error) {
              console.error('Error fetching video details:', error);
            }
        };
        fetchVideoDetails();
    }, [searchStreamDetails, videoId]);
    const handleConsumeYoutubeLiveChat = () => {
        setConsumingYoutubeLiveChat(true);
    };
    const handleStopConsumingYoutubeLiveChat = () => {
        setConsumingYoutubeLiveChat(false);
    };
    const handleSearchStreamDetails = () => {
        setSearchStreamDetails(true);
    };
    return (
        <React.Fragment>
            <Container maxWidth="lg">
                <Typography 
                    variant="h4" 
                    component="h3" 
                    style={{marginTop: '45px', marginBottom: '15px'}}
                    align="center"
                >
                    Theo dõi cảm xúc từ bình luận trực tuyến
                </Typography>
                <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                    <Typography variant="h6">Nhập ID của stream</Typography>
                        
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '25ch' },
                            }}
                            noValidate
                            autoComplete="off"
                            style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                            >
                                <TextField 
                                    id="standard-basic" 
                                    label="StreamID" 
                                    variant="standard" 
                                    value={videoId}
                                    onChange={(event) => setVideoId(event.target.value)}
                                />
                                <Button 
                                    variant='contained'
                                    onClick={handleSearchStreamDetails}
                                >
                                    Tìm kiếm
                                </Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                    <Typography variant="h6">Thông tin của stream</Typography>
                    {streamDetails ?? false ? (
                        <React.Fragment>
                            <Typography variant='body1'>{streamDetails.channelTitle}</Typography>
                            <Typography variant='body2'>{streamDetails.title}</Typography>
                        </React.Fragment>
                    ) : (
                        <Typography variant='body1'>Chưa có thông tin về stream.</Typography>
                    )} 
                    </Paper>
                </Grid>
                </Grid>
                {/* <StatisticsUI /> */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <ButtonGroup aria-label="medium secondary button group">
                        <Button 
                            variant="contained"
                            onClick={handleConsumeYoutubeLiveChat}
                        >
                            Theo dõi
                        </Button>
                        <Button 
                            variant="outlined"
                            onClick={handleStopConsumingYoutubeLiveChat}
                        >
                            Tạm dừng theo dõi
                        </Button>
                    </ButtonGroup>
                </div>
                <div>
                    
                    <Grid container spacing={2} style={{marginTop: '15px'}}>
                        <Grid item xs={8}>
                            <Item>
                                <React.Fragment>
                                    <Typography 
                                        variant="body1" 
                                        align="center"
                                        style={{marginTop: '15px', color: 'black'}}
                                    >
                                        Danh sách bình luận
                                    </Typography>
                                    {consumingYoutubeLiveChat === true && emptyDataResponse === true && (
                                        <Typography 
                                            variant="body1" 
                                            align="center"
                                        >
                                            Theo dõi bình luận sau mỗi 5s. Hiện tại chưa có bình luận mới.
                                        </Typography>
                                    )}
                                    {consumingYoutubeLiveChat === false && isInitialRender.current === true && (
                                        <Typography 
                                            variant="body1" 
                                            align="center"
                                            style={{marginTop: '15px'}}
                                        >
                                            Bạn chưa nhấn nút theo dõi
                                            Nhấn "theo dõi" để quan sát bình luận
                                        </Typography>
                                    )}
                                    {consumingYoutubeLiveChat === false && isInitialRender.current === false && (
                                        <Typography 
                                            variant="body1" 
                                            align="center"
                                            style={{marginTop: '15px'}}
                                        >
                                            Bạn đã dừng theo dõi. Vui lòng nhấn theo dõi để quan sát bình luận.
                                        </Typography>
                                    )}
                                    <div style={{overflowY: 'auto', maxHeight: '300px', marginTop: '6px'}}>
                                        <ul ref={youtubeLiveChatListRef} 
                                            style={{ display: 'flex', flexDirection: 'column', 
                                            justifyContent: 'center', marginTop: '20px',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                        }}>
                                        </ul>
                                    </div>
                                </React.Fragment>
                            </Item>
                        </Grid>
                        <Grid item xs={4}>
                            <Item>
                                <Card>
                                    <CardContent style={{textAlign: 'left'}}>
                                        <Typography variant="body1" style={{display: 'flex', alignItems: 'center'}}>
                                            <span>Tổng số bình luận:</span>
                                            <span style={{marginLeft: '5px'}} ref={totalLiveChatCommentsRef}>
                                                {totalLiveChatComments.current}
                                            </span>
                                        </Typography>
                                        <Typography variant="body1" style={{display: 'flex', alignItems: 'center'}}>
                                            <span className="neutral-box"></span>
                                            <span>Trung tính:</span>
                                            <span style={{marginLeft: '5px'}} ref={neutralLiveChatCommentsRef}>
                                                {neutralLiveChatComments.current}
                                            </span>
                                        </Typography>
                                        <Typography variant="body1" style={{display: 'flex', alignItems: 'center'}}>
                                            <span className="positive-box"></span>
                                            <span>Tích cực:</span>
                                            <span style={{marginLeft: '5px'}} ref={positiveLiveChatCommentsRef}>
                                                {positiveLiveChatComments.current}
                                            </span>
                                        </Typography>
                                        <Typography variant="body1" style={{display: 'flex', alignItems: 'center'}}>
                                            <span className="negative-box"></span>
                                            <span>Tiêu cực:</span>
                                            <span style={{marginLeft: '5px'}} ref={negativeLiveChatCommentsRef}>
                                                {negativeLiveChatComments.current}
                                            </span>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Item>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </React.Fragment>
    );
};

export default App;
