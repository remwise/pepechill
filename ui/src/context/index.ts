import React, { useState } from "react";
import io from "socket.io-client";
import { API_URL } from "../constants";
import { axiosInstance } from "../request";

export type User = {
  userId: null | string;
  username: null | string;
};

export type State = User & {
  isLoadingUser: boolean;
};

export interface RenderProps {
  state: State;
  loadUser: (username: string) => void;
  logout: () => void;
  sendData: (data: any) => void;
}

export interface Props {
  children: (renderProps: RenderProps) => React.ReactElement;
}

const socket = io(API_URL);

export const DataComponent: React.FC<Props> = (props) => {
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId") || null
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username") || null
  );
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const setUserData = (user: User) => {
    setUserId(user.userId);
    setUsername(user.username);
    localStorage.setItem("userId", user.userId || "");
    localStorage.setItem("username", user.username || "");
  };

  const loadUser = async (username: string) => {
    try {
      setIsLoadingUser(true);
      const user: User = (await axiosInstance.post("user", { username })).data;
      setUserData(user);
    } catch (error) {
      console.log("error :>> ", error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const logout = () => {
    setUserData({ userId: null, username: null });
  };

  const sendData = (data: any) => {
    socket.emit("send data", { data });
  };

  return props.children({
    state: { userId, username, isLoadingUser },
    loadUser,
    logout,
    sendData,
  });
};
