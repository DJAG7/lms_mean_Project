const { default: axios } = require("axios");


const createNewMeeting = async (req, res) => {
  try {
    const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'client_credentials',
        client_id: process.env.ZOOM_CLIENT_ID,
        client_secret: process.env.ZOOM_CLIENT_SECRET,
      },
    });
    // res.json(tokenResponse.data);
    // return;
    const accessToken = tokenResponse.data.access_token;
    const meetingStartTime = new Date(); // Replace with your desired start time
    meetingStartTime.setHours(23); // Set the hours (24-hour format)
    meetingStartTime.setMinutes(0); // Set the minutes
    // Step 2: Create a Zoom meeting using the access token
    const createMeetingResponse = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: 'My Zoom Meeting',
        type: 2, // 2 for scheduled meetings
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const meetingInfo = createMeetingResponse.data;
    console.log(meetingInfo);
    res.json(meetingInfo);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
};
module.exports = { createNewMeeting };
