import React, { Component } from "react";
import video1 from '../assets/loading_video.mp4'

class Video extends Component {
  render() {
    return (
      <div>
        <video src={video1} />
      </div>
    );
  }
}

export default Video;