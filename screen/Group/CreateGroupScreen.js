import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducer';
import userApi from '../../apis/userApi';
import ButtonComponent from '../../components/ButtonComponent';
import HeaderComponent from '../../components/HeaderComponet';
import TextComponent from '../../components/TextComponent';
import { COLORS, APPINFOS } from '../../constants';
import { globalStyles } from '../../styles/globalStyle';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { Ionicons} from '@expo/vector-icons'; // Thêm import cho các biểu tượng
import defaultAvatar from "../../assets/images/user.png";
import { io } from 'socket.io-client';
import { Avatar } from 'react-native-paper';

const CreateGroupScreen = () => {
    const socket = io(`${APPINFOS.BASE_URL}`);
    const navigation = useNavigation();
    const user = useSelector(authSelector);
    const userId = user.id;
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [groupName, setGroupName] = useState('');

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

    const handlePress = (item) => {
        const isSelected = selectedFriends.some(friend => friend._id === item._id);
        if (isSelected) {
            setSelectedFriends(prevState => prevState.filter(friend => friend._id !== item._id));
        } else {
            setSelectedFriends(prevState => [...prevState, item]);
        }
    };

    const createGroup = async () => {
        try {
            const response = await fetch(`${APPINFOS.BASE_URL}/groups/new-groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: groupName,
                    members: selectedFriends.map(friend => friend._id),
                    avatar: null,
                    creatorId: userId

                }),
            });
            const group = await response.json();
            console.log(group);
            if (response.ok) {
                socket.emit("groupCreated", { group, members: selectedFriends.map(friend => friend._id)});
                navigation.navigate('Tin nhắn');
            }

        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    return (
        <View style={globalStyles.container}>
            <HeaderComponent
                style={{
                    flexDirection: 'row',
                    backgroundColor: COLORS.primary,
                    height: APPINFOS.sizes.HEIGHT * 0.06,
                    alignItems: 'center',
                    paddingLeft: 16,
                }}
                title="Tạo nhóm"
                fontFamily="medium"
                onBackPress={() => navigation.goBack()}
                color={COLORS.white}
                size={18}
            />
            <View style={styles.inputContainer}>
                <Image
                    source={require('../../assets/images/group.png')}
                    style={styles.groupIcon}
                />
                <TextInput
                    placeholder="Tên nhóm"
                    value={groupName}
                    onChangeText={text => setGroupName(text)}
                    style={styles.nameInput}
                />
            </View>
            <FlatList
                data={friends}
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
                            </View>
                            {selectedFriends.some(friend => friend._id === item._id) ? (
                                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                            ) : (
                                <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.grey} />
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
            <View style={{ alignItems: 'center' }}>
                <ButtonComponent
                    title="Tạo nhóm"
                    type={'primary'}
                    onPress={createGroup}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grey,
        width: APPINFOS.sizes.WIDTH,
    },
    groupIcon: {
        width: 50,
        height: 50,
        alignSelf: 'center',
    },
    nameInput: {
        padding: 16,
        width: '80%',
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
});

export default CreateGroupScreen;
