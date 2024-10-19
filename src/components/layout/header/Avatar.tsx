import React, { useRef } from 'react';

interface AvatarProps {
  userImg: any
  altText?: string
  w: string,
  h: string,
  //size?: "small" | "medium" | "large" | "extralarge"
  //onClick: any
}

const Avatar: React.FC<AvatarProps> = ({
  userImg,
  //onClick,
  altText = "User Avatar",
  //size = 'medium'
  w,h
}) => {
 

  return (
    <div
      className={`inline-block overflow-hidden rounded-full`}
      style={{ width: w, height: h }}
    >
      <img
        src={userImg}
        alt={altText}
        className="h-full w-full object-cover"
        //onClick={onClick}
      />
    </div>
  )
}

export default Avatar
