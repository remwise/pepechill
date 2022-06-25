import React, { useState } from "react";
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
}

export interface Props {
  children: (renderProps: RenderProps) => React.ReactElement;
}

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

  //   const sendData = () => {
  //     // const socket = io(API_URL);
  //     // socket.emit("send data", { data: "tmp" });
  //   };

  return props.children({
    state: { userId, username, isLoadingUser },
    loadUser,
    logout,
  });
};
