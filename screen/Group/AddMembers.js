import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, alert, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducer';
import * as ImagePicker from 'expo-image-picker';
import userApi from '../../apis/userApi';
import ButtonComponent from '../../components/ButtonComponent';
import HeaderComponent from '../../components/HeaderComponet';
import TextComponent from '../../components/TextComponent';
import { COLORS, APPINFOS } from '../../constants';
import { globalStyles } from '../../styles/globalStyle';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import defaultAvatar from "../../assets/images/user.png";
import axios from 'axios';
import groupApi from '../../apis/groupApi';
import { Avatar } from 'react-native-paper';
import io from 'socket.io-client';

const AddMembers = ({ route }) => {
    const socket = io(`${APPINFOS.BASE_URL}`);  
    const navigation = useNavigation();
    const user = useSelector(authSelector);
    const userId = user.id;
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const groupId = route.params._id
    const group = route.params
    console.log('group', group)
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await userApi.handleUser(
                    `/getFriends/${userId}`,
                    {},
                    "GET"
                );
                setFriends(response);
            } catch (error) {
                console.error(error);
            }
        };
        fetchFriends();
    }, []);

    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await groupApi.handleGroups(`/get-group-members/${groupId}`, {}, "GET");
                setMembers(response.groupMembers);
            } catch (error) {
                console.error(error);
            }
        }
        getMembers();
    }
        , []);

    // Filter friends who are not in the group
    const friendsNotInGroup = friends.filter(friend => !members.some(member => member._id === friend._id));
    const handlePress = (item) => {
        const isSelected = selectedFriends.some(friend => friend._id === item._id);
        if (isSelected) {
            setSelectedFriends(prevState => prevState.filter(friend => friend._id !== item._id));
        } else {
            setSelectedFriends(prevState => [...prevState, item]);
        }
    };


    const handleAddMember = () => {
        if (selectedFriends.length >= 1) {
            const membersToAdd = selectedFriends.map(friend => friend._id);
            const response = groupApi.handleGroups(`/${groupId}/members`,
                {
                    memberIds: membersToAdd,
                }, "POST");
            socket.emit("memberAdded", { group, members: membersToAdd});
            Alert.alert('Thêm thành viên thành công');
            navigation.goBack();
        } else {
            alert('Vui lòng chọn ít nhất 1 người bạn để thêm vào nhóm');
        }
    };


    return (
        <View style={globalStyles.container}>
            <HeaderComponent
                title="Thêm thành viên"
                style={{
                    flexDirection: 'row',
                    backgroundColor: COLORS.primary,
                    height: APPINFOS.sizes.HEIGHT * 0.06,
                    alignItems: 'center',
                    paddingLeft: 16,

                }}
                fontFamily="medium"
                onBackPress={() => navigation.goBack()}
                color={COLORS.white}
                size={18}
            />
            <FlatList
                data={friendsNotInGroup}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlePress(item)}>
                        <View style={styles.friendItem}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',

                            }}>
                                <Avatar.Image
                                    size={50}
                                    imageStyle={styles.friendAvatar}
                                    source={item.photoUrl ? { uri: item.photoUrl } : defaultAvatar}
                                />
                                <TextComponent text={item.fullname} style={styles.friendName} />
                            </View >
                            {selectedFriends.some(friend => friend._id === item._id) ? (
                                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                            ) : (
                                <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.grey} />
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
            <View style={styles.buttonContainer}>
                <ButtonComponent
                    title="Thêm"
                    type={'primary'}
                    onPress={handleAddMember}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.primary,
        height: APPINFOS.sizes.HEIGHT * 0.06,
        paddingLeft: 16,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        justifyContent: 'space-between'
    },
    friendAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    friendName: {
        marginLeft: 16,
    },
    buttonContainer: {
        alignItems: 'center',
    },
});

export default AddMembers;
