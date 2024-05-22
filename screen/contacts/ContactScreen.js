import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { COLORS, APPINFOS } from "../../constants";
import { globalStyles } from "../../styles/globalStyle";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { userSelector, getFriends } from '../../redux/reducers/userReducer';
import { useSelector, useDispatch } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducer';
import { Avatar } from "react-native-paper";
import defaultAvatar from "../../assets/images/user.png";
import userApi from "../../apis/userApi";


const ContactScreen = () => {

  const user = useSelector(authSelector);
  const userId = user.id;
  console.log("user", user.id);

  const [fetchFriend, setFetchFriend] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userApi.handleUser(`/getFriends/${userId}`,
          {},
          "GET");
        console.log("response", response);
        setFetchFriend(response);
      } catch (error) {
        console.log("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const navigation = useNavigation();
  const handlePressContact = (item) => {
    navigation.navigate("DetailsScreen", { contact: item });
  };



  const renderContactItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePressContact(item)}>
      <View style={styles.contactItem}>
        <Avatar.Image
          size={50}
          source={item.photoUrl ? { uri: item.photoUrl } : defaultAvatar}
          style={styles.contactImage}
        />
        <View style={styles.contactDetails}>
          <View style={styles.contactHeader}>
            <Text style={styles.contactName}>{item.fullname}</Text>
            <Icon
              name="phone"
              size={25}
              color={COLORS.gray4}
              style={styles.phoneIcon}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );



  return (
    <View style={globalStyles.container}>


      <FlatList
        data={fetchFriend}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderContactItem}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contactDetails: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: "row",
    justifyContent: "space-between", // Đặt biểu tượng và tên liên hệ vào hai phía
    alignItems: "center",
  },
  contactName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  phoneIcon: {
    marginLeft: 5,
  },
  flatListContent: {
    paddingBottom: 20, // Add padding to the bottom to separate the last item from the edge of the screen
  },
});

export default ContactScreen;
