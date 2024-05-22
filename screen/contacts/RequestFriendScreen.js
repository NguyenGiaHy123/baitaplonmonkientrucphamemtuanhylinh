import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { COLORS, APPINFOS } from "../../constants";
import { globalStyles } from "../../styles/globalStyle";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { acceptFriendRequest, userSelector, getSendFriendRequest, deleteFriendRequest } from '../../redux/reducers/userReducer';
import { useSelector, useDispatch } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducer';
import { Avatar } from "react-native-paper";
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import userApi from "../../apis/userApi";
import { io } from "socket.io-client";


const RequestFriendScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector(authSelector);
    const socket = io(`${APPINFOS.BASE_URL}`);


    const handlePressContact = (contact) => {
        navigation.navigate("DetailsScreen", { contact });
    };
    useEffect(() => {
        if (user) {
            dispatch(getSendFriendRequest({ userId: user.id }));
            console.log("user:", user.id);
        }
    }, [dispatch, user]);
    const friends = useSelector(userSelector);


    const handleAccept = (item) => {
        dispatch(acceptFriendRequest({ userId: user.id, friendId: item._id }));
        console.log("friend", item._id);
        console.log("user", user.id);

    }

    handleDelete = (item) => {
        dispatch(deleteFriendRequest({ userId: user.id, friendId: item._id }));
    }


    const renderUserRequest = ({ item }) => (
        <TouchableOpacity onPress={() => handlePressContact(item)}>
            <View style={styles.contactItem}>
                <Avatar.Image size={50} source={{ uri: item.photoUrl }} style={styles.contactImage} />
                <View style={styles.contactDetails}>
                    <View style={styles.contactHeader}>
                        <Text style={styles.contactName}>{item.fullname}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => handleAccept(item)}>
                                <Ionicons name="checkmark-done" size={24} color="green" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item)}>
                                <MaterialIcons name="delete" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={globalStyles.container}>
            <View >

                <FlatList
                    data={friends}
                    keyExtractor={(item) => item.id}
                    renderItem={renderUserRequest}
                    contentContainerStyle={styles.flatListContent}
                />
            </View>



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

export default RequestFriendScreen;
