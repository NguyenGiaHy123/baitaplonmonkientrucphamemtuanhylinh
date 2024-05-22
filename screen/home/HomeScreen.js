import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import HeaderComponent from "../../components/HeaderComponet";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { COLORS, APPINFOS } from "../../constants";
import { globalStyles } from "../../styles/globalStyle";
import { Avatar } from "react-native-paper";
import defaultAvatar from "../../assets/images/user.png";
import groupAvatar from "../../assets/images/group.png";
import { groupApi } from "../../apis/groupApi";
import { friendApi } from "../../apis/friendApi";
import io from "socket.io-client";

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const user = useSelector(authSelector);
  const userId = user.id;
  const [friendsAndGroups, setFriendsAndGroups] = useState([]);
  const socket = io(`${APPINFOS.BASE_URL}`);
  const [reload, setReload] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [reload])
  );

  useEffect(() => {
    socket.emit("register", userId);
  }, []);

  useEffect(() => {
    if (route.params?.reloadHomeScreen) {
      route.params.reloadHomeScreen = false; // Reset lại biến reloadHomeScreen để tránh việc kích hoạt nhiều lần
      setReload(true);
    }
  }, [route.params?.reloadHomeScreen]);

  const fetchData = async () => {
    try {
      const groupsResponse = await groupApi.handleGroups(
        `/get-group-list/${userId}`,
        {},
        "GET"
      );

      const friendsResponse = await friendApi.handleFriend(
        `/getFriends/${userId}`,
        {},
        "GET"
      );

      setFriendsAndGroups([
        ...groupsResponse.map((group) => ({ ...group, type: "group" })),
        ...friendsResponse.map((friend) => ({ ...friend, type: "friend" })),
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket.on("newGroup", (group) => {
      setFriendsAndGroups((prevState) => [
        ...prevState,
        { ...group, type: "group" },
      ]);
    });
    return () => {
      socket.off("newGroup");
    };
  }, []);

  // Xử lý sự kiện nhận thông báo giải tán nhóm
  useEffect(() => {
    socket.on("groupDeleted", (group) => {
      console.log("groupDeleted", group);
      setFriendsAndGroups((prevState) =>
        prevState.filter((item) => item._id !== group)
      );
    });
    return () => {
      socket.off("groupDeleted");
    };
  }, []);
   useEffect(() => {
     socket.on("updateGroup", (group) => {
       console.log("updateGroup", group);
       setFriendsAndGroups((prevState) => [
         ...prevState,
         { ...group, type: "group" },
       ]);
     });
     return () => {
       socket.off("updateGroup");
     };
   }, []);

  const handleDishbandGroup = async () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn giải tán nhóm?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              await groupApi.handleGroups(
                `/deleteGroup/${groupId}`,
                {},
                "DELETE"
              );
              navigation.navigate("Tin nhắn", { reloadHomeScreen: true }); // Truyền thông tin reload
            } catch (error) {
              console.log("Failed to disband group: ", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handlePress = (item) => {
    if (item.type === "group") {
      navigation.navigate("GroupScreen", {
        //gui nguyen 1 object
        group: item,
        groupId: item._id,
        groupName: item.name,
        groupImg: item.avatar,
        members: item.members,
        leader: item.leader,
        coLeader: item.coLeader,
      });
    } else {
      navigation.navigate("MessageScreen", {
        userName: item.fullname,
        friendId: item._id,
        friendImg: item.photoUrl
          ? item.photoUrl
          : "https://phambabac.s3.ap-southeast-1.amazonaws.com/zalo/W%5Bobject%20Object%5D_W1715658700943.png",
      });
    }
  };

  return (
    <View style={globalStyles.container}>
      <HeaderComponent
        style={{
          flexDirection: "row",
          backgroundColor: COLORS.primary,
          height: APPINFOS.sizes.HEIGHT * 0.06,
          alignItems: "center",
          paddingLeft: 16,
        }}
        iconsSearch={true}
        search={() => navigation.navigate("SearchScreen")}
        add={() => navigation.navigate("CreateGroupScreen")}
        fontFamily={"medium"}
        color={COLORS.white}
        size={18}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          data={friendsAndGroups}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <View style={styles.conversation}>
                <Avatar.Image
                  size={60}
                  style={{ marginRight: 10 }}
                  source={
                    item.type === "group"
                      ? item.avatar
                        ? { uri: item.avatar }
                        : groupAvatar
                      : item.photoUrl
                        ? { uri: item.photoUrl }
                        : {
                            uri: "https://phambabac.s3.ap-southeast-1.amazonaws.com/zalo/W%5Bobject%20Object%5D_W1715658700943.png",
                          }
                  }
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>
                    {item.type === "group" ? item.name : item.fullname}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conversation: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: COLORS.primary,
    borderBottomWidth: 0.4,
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  lastMessageDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
});

export default HomeScreen;
