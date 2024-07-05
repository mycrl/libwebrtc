//
//  video_encoder.h
//  rtc
//
//  Created by Mr.Panda on 2023/2/21.
//

#ifndef LIBRTC_VIDEO_ENCODER_H
#define LIBRTC_VIDEO_ENCODER_H
#pragma once

#include "api/video_codecs/video_encoder_factory.h"

class IVideoEncoderFactory
	: public webrtc::VideoEncoderFactory
{
public:
	IVideoEncoderFactory();
	static std::unique_ptr<IVideoEncoderFactory> New();

	// Returns a list of supported video formats in order of preference, to use
	// for signaling etc.
	std::vector<webrtc::SdpVideoFormat> GetSupportedFormats() const;

	// Creates a VideoEncoder for the specified format.
	std::unique_ptr<webrtc::VideoEncoder> Create(const webrtc::Environment& env, 
												 const webrtc::SdpVideoFormat& format);
private:
	std::vector<webrtc::SdpVideoFormat> _formats;
};

#endif  // LIBRTC_VIDEO_ENCODER_H
