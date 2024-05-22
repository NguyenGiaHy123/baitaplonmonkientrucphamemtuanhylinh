import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import TextComponent from "../../components/TextComponent";
import { COLORS, APPINFOS } from "../../constants";
import { globalStyles } from "../../styles/globalStyle";
import { FlatList } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducer';
import groupAvatar from "../../assets/images/group.png";
import { groupApi } from "../../apis/groupApi";

const ListGroupScreen = () => {
    const navigation = useNavigation();
    const user = useSelector(authSelector);
    const userId = user.id;

    const [friendsAndGroups, setFriendsAndGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const groupsResponse = await groupApi.handleGroups(
                    `/get-group-list/${userId}`,
                    {},
                    "GET"
                );
                setFriendsAndGroups(groupsResponse);
            } catch (error) {
                console.error(error);
            }
        };
        fetchGroups();
    }, [userId]);

    return (
        <View style={styles.container}>
            {/* Uncomment and update HeaderComponent if needed */}
            {/* <HeaderComponent
                style={{
                    flexDirection: "row",
                    backgroundColor: COLORS.primary,
                    height: APPINFOS.sizes.HEIGHT * 0.06,
                    alignItems: "center",
                    paddingLeft: 16,
                    justifyContent: "space-between",
                }}
                title="Danh sách nhóm"
                fontFamily={"medium"}
                color={COLORS.white}
                size={18}
            /> */}
            <FlatList
                data={friendsAndGroups}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("GroupScreen", {
                                groupId: item.id,
                                groupName: item.name,
                                groupAvatar: item.avatar,
                            });
                        }}
                    >
                        <View style={globalStyles.listItemContainer}>
                            <View style={styles.listItem}>
                                <Avatar.Image
                                    size={40}
                                    source={item.avatar ? { uri: item.avatar } : groupAvatar}
                                />
                                <View style={styles.listItemContent}>
                                    <TextComponent
                                        style={styles.listItemTitle}
                                        fontFamily={"medium"}
                                        color={COLORS.black}
                                        size={16}
                                        text={item.name}
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginVertical: 5,
    },
    listItemContent: {
        marginLeft: 10,
    },
    listItemTitle: {
        fontSize: 16,
        color: COLORS.black,
    },
});

export default ListGroupScreen;
