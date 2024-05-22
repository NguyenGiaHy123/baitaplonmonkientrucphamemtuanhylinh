import React, { useState, useCallback, useEffect } from "react";
import {
  Linking,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import {
  Bubble,
  GiftedChat,
  Send,
  InputToolbar,
  Actions,
} from "react-native-gifted-chat";
import { useSelector } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import HeaderComponent from "../../components/HeaderComponet";
import { APPINFOS } from "../../constants";
import io from "socket.io-client";
import { authSelector } from "../../redux/reducers/authReducer";
import { COLORS } from "../../constants";
import * as DocumentPicker from "expo-document-picker";
import { Video } from "expo-av";
import axios from "axios";

const MessageScreen = ({ navigation, route }) => {
  const socket = io(`${APPINFOS.BASE_URL}`);
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isUserMessage, setIsUserMessage] = useState(false); // Add this state
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const user = useSelector(authSelector);
  const userId = user.id;
  const userPhotp = user.photoUrl;
  const friendId = route.params.friendId;
  const userImg = route.params.friendImg;
  const roomId = [userId, friendId].sort().join("-");

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${APPINFOS.BASE_URL}/messages/getMessages?from=${userId}&to=${friendId}`
      );
      const data = await response.json();
      const visibleMessages = data.filter(
        (msg) => !(msg.isHidden && msg.fromSelf)
      );
      const fetchedMessages = visibleMessages.map((msg) => ({
        _id: msg.id,
        text: msg.message,
        createdAt: new Date(msg.createdAt),
        user: {
          _id: msg.fromSelf ? userId : friendId,
          avatar: msg.fromSelf ? userPhotp : userImg,
        },
        isHidden: msg.isHidden,
        fromSelf: msg.fromSelf,
      }));

      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, friendId]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, message)
      );
    });

    socket.emit("createRoom", { userId, friendId });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, friendId]);

  useEffect(() => {
    socket.on("messageRecalled", (messageId) => {
      setMessages((previousMessages) =>
        previousMessages.map((msg) =>
          msg._id === messageId
            ? { ...msg, text: "đã thu hồi 1 tin nhắn" }
            : msg
        )
      );
    });
    return () => {
      socket.off("messageRecalled");
    };
  }, []);

  const fileIcons = {
    pdf: require("../../assets/icons/pdf.png"),
    csv: require("../../assets/icons/csv.png"),
    doc: require("../../assets/icons/doc.png"),
    json: require("../../assets/icons/json.png"),
    docx: require("../../assets/icons/doc.png"),
    txt: require("../../assets/icons/txt.png"),
  };

  const onSend = useCallback(
    (newMessages = []) => {
      const message = newMessages[0];
      message.user._id = userId;
      message.roomId = roomId;

      socket.emit("sendMessage", message);

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      fetch(`${APPINFOS.BASE_URL}/messages/addMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: userId,
          to: friendId,
          message: message.text,
          avatar: userImg,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    },
    [userId, roomId, friendId, userImg]
  );

  const handleLongPressMessage = (context, message) => {
    setSelectedMessage(message);
    setIsUserMessage(message.user._id === userId); // Set the sender information
    setModalVisible(true);
  };

  async function handleRecallMessage(selectedMessage) {
    try {
      const messageId = selectedMessage._id; // Lấy ID của tin nhắn từ đối tượng tin nhắn
      const response = await axios.delete(
        `${APPINFOS.BASE_URL}/messages/${messageId}`
      );

      if (response.status === 200) {
        socket.emit("recallMessage", { messageId, room: roomId });
        setModalVisible(false);
        fetchData();
      } else {
        console.error("Failed to recall message:", response.data);
      }
    } catch (error) {
      console.error("Error recalling message:", error);
    }
  }

  const retrieveMessage = async () => {
    try {
      if (!selectedMessage) {
        console.error("No message selected to retrieve.");
        return;
      }

      const messageId = selectedMessage._id;
      const senderId = selectedMessage.user._id;
      console.log("Sender ID:", senderId);

      const response = await axios.patch(
        `${APPINFOS.BASE_URL}/messages/${messageId}/${senderId}`
      );

      if (response.status === 200) {
        console.log("Message retrieved successfully.");
        setModalVisible(false);
        fetchData();
      } else {
        console.error("Failed to retrieve message:", response.data);
      }
    } catch (error) {
      console.error("Error retrieving message:", error);
    }
  };


  const onBackPress = () => {
    navigation.goBack();
  };

  const uploadFile = async (userId) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.type === "cancel" || !result.assets || !result.assets[0]) {
        return;
      }

      let formData = new FormData();
      let fileType = result.assets[0].name
        ? `test/${result.assets[0].name.split(".").pop()}`
        : "unknown";

      formData.append("file", {
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        type: fileType,
      });
      console.log(result);

      const response = await fetch(
        `${APPINFOS.BASE_URL}/users/upload/${userId}`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const fileUrl = data.fileUrl;
      setUploadedFileUrl(fileUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const renderActions = (props) => {
    return (
      <Actions
        {...props}
        icon={() => (
          <MaterialCommunityIcons
            name="attachment"
            size={23}
            color={COLORS.primary}
          />
        )}
        onPressActionButton={uploadFile}
      />
    );
  };

  const renderMessageImage = (props) => {
    return (
      <View>
        <Image
          style={{ width: 200, height: 200 }}
          resizeMode="cover"
          source={{ uri: props.currentMessage.image }}
        />
      </View>
    );
  };

  const renderBubble = (props) => {
    const imageUrlRegex = /\.(jpeg|jpg|png|gif)$/i;
    const isImageMessage = imageUrlRegex.test(props.currentMessage.text);

    const fileUrlRegex = /\.(pdf|doc|txt|json|csv|xls|xlsx|docx)$/i;
    const isFileMessage = fileUrlRegex.test(props.currentMessage.text);

    const videoUrlRegex = /\.(mp4|mov|avi)$/i;
    const isVideoMessage = videoUrlRegex.test(props.currentMessage.text);

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "white",
            maxWidth: "85%",
          },
          right: {
            maxWidth: "85%",
          },
        }}
        renderMessageText={
          isImageMessage
            ? () => (
              <View>
                <Image
                  source={{ uri: props.currentMessage.text }}
                  style={{
                    width: 200,
                    height: 200,
                    resizeMode: "cover",
                    alignSelf: "center",
                  }}
                />
                {/* <TouchableOpacity
                    style={{
                      width: 200,
                      height: 50,
                      alignSelf: "center",
                      margin: 10,
                    }}
                    onPress={() => Linking.openURL(props.currentMessage.text)}
                  >
                    <Text style={{ color: "black" }}>
                      {props.currentMessage.text}
                    </Text>
                  </TouchableOpacity> */}
              </View>
            )
            : isVideoMessage
              ? () => (
                <View>
                  <Video
                    source={{ uri: props.currentMessage.text }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay={false}
                    isLooping
                    useNativeControls
                    style={{
                      width: 300,
                      height: 200,
                      alignSelf: "center",
                      margin: 10,
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      width: 300,
                      height: 50,
                      alignSelf: "center",
                      margin: 10,
                    }}
                    onPress={() => Linking.openURL(props.currentMessage.text)}
                  >
                    <Text style={{ color: "black" }}>
                      {props.currentMessage.text}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
              : isFileMessage
                ? () => (
                  <View>
                    <Image
                      source={
                        fileIcons[props.currentMessage.text.split(".").pop()]
                      }
                      style={{
                        width: 100,
                        height: 80,
                        resizeMode: "cover",
                        alignSelf: "center",
                        margin: 10,
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        width: 100,
                        height: 50,
                        alignSelf: "center",
                        margin: 10,
                      }}
                      onPress={() =>
                        Linking.openURL(props.currentMessage.text)
                      }
                    >
                      <Text style={{ color: "black" }}>
                        {props.currentMessage.text}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )
                : null
        }
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.gray2 }}>
      <HeaderComponent
        title={route.params.userName}
        style={{
          flexDirection: "row",
          backgroundColor: COLORS.primary,
          height: APPINFOS.sizes.HEIGHT * 0.06,
          alignItems: "center",
          paddingLeft: 16,
        }}
        fontFamily={"medium"}
        onBackPress={onBackPress}
        color={COLORS.white}
        size={18}
      />
      <GiftedChat
        messages={messages.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )}
        onSend={onSend}
        user={{
          _id: userId,
          avatar: userImg,
        }}
        onLongPress={(context, message) =>
          handleLongPressMessage(context, message)
        }
        renderBubble={renderBubble}
        renderMessageImage={renderMessageImage}
        renderActions={renderActions}
        alwaysShowSend
        renderSend={(props) => (
          <Send {...props}>
            <View>
              <MaterialCommunityIcons
                name="send-circle"
                style={{ marginBottom: 5, marginRight: 5 }}
                size={32}
                color={COLORS.primary}
              />
            </View>
          </Send>
        )}
        scrollToBottom
        scrollToBottomComponent={() => (
          <FontAwesome
            name="angle-double-down"
            size={22}
            color={COLORS.primary}
          />
        )}
        renderInputToolbar={(props) => {
          if (uploadedFileUrl) {
            return (
              <InputToolbar
                {...props}
                text={uploadedFileUrl}
                onTextChanged={() => setUploadedFileUrl("")}
                containerStyle={{
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: COLORS.white,
                }}
              />
            );
          } else {
            return (
              <InputToolbar
                {...props}
                text={props.text}
                containerStyle={{
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: COLORS.white,
                }}
              />
            );
          }
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              width: "90%", // Adjust width to fit the screen
              height: "30%",
              padding: 10,
              justifyContent: "center",
              marginBottom: 40,
            }}
          >
            {isUserMessage ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginVertical: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleRecallMessage(selectedMessage)}
                    style={{ alignItems: "center" }}
                  >
                    <MaterialCommunityIcons name="undo" size={30} color="red" />
                    <Text style={{ color: "red" }}>Thu hồi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={retrieveMessage}
                    style={{ alignItems: "center" }}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={30}
                      color="blue"
                    />
                    <Text style={{ color: "blue" }}>Xóa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={{}}
                    style={{ alignItems: "center" }}
                  >
                    <MaterialCommunityIcons
                      name="forward"
                      size={30}
                      color="green"
                    />
                    <Text style={{ color: "green" }}>Chuyển tiếp</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={{}}
                    style={{ alignItems: "center" }}
                  >
                    <MaterialCommunityIcons
                      name="reply"
                      size={30}
                      color="purple"
                    />
                    <Text style={{ color: "purple" }}>Trả lời</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginVertical: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={retrieveMessage}
                    style={{ alignItems: "center" }}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={30}
                      color="blue"
                    />
                    <Text style={{ color: "blue" }}>Xóa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={{}}
                    style={{ alignItems: "center" }}
                  >
                    <MaterialCommunityIcons
                      name="forward"
                      size={30}
                      color="green"
                    />
                    <Text style={{ color: "green" }}>Chuyển tiếp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={{}}
                    style={{ alignItems: "center" }}
                  >
                    <MaterialCommunityIcons
                      name="reply"
                      size={30}
                      color="purple"
                    />
                    <Text style={{ color: "purple" }}>Trả lời</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MessageScreen;
