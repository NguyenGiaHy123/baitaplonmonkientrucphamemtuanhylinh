import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { authSelector } from '../../redux/reducers/authReducer';
import groupApi from '../../apis/groupApi';
import { globalStyles } from "../../styles/globalStyle";
import { COLORS, APPINFOS } from "../../constants";
import HeaderComponent from "../../components/HeaderComponet";
import TextComponent from "../../components/TextComponent";
import defaultAvatar from "../../assets/images/user.png";
import io from "socket.io-client";

const SettingChat = ({ route }) => {
    const socket = io(`${APPINFOS.BASE_URL}`);
    const navigation = useNavigation();
    const user = useSelector(authSelector);
    const [members, setMembers] = React.useState([]);
    const userId = user.id;
    const {
        groupId,
        groupName,
        groupImg,
        groupMembers,
        leader,
        coLeader
    } = route.params;


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
    }, [groupId]);

    const handleShowMember = () => {
        navigation.navigate('ListMember', {
            groupId,
            groupName,
            groupImg,
            groupMembers,
            leader,
            coLeader
        });
    }

    const handleAddMember = () => {
        navigation.navigate("AddMembers", {
            _id: groupId,
            name: groupName,
            avatar: groupImg,
            groupMembers,
            leader,
            coLeader,
        });
    }
    const getLeader = members.find((member) => member.role === 'leader');
    const leaderId = getLeader?._id;
    const handleLeaveGroup = async () => {
        if (isLeader === true) {
            Alert.alert('Bạn không thể rời nhóm khi bạn là người tạo nhóm');
        } else {
            Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn rời nhóm?', [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Xác nhận',
                    onPress: async () => {
                        try {
                            await groupApi.handleGroups(`/leaveGroup/${groupId}/${userId}`, {}, 'DELETE');

                            navigation.navigate('Tin nhắn');
                        } catch (error) {
                            console.log('Failed to leave group: ', error);
                        }
                    },
                },
            ],
                { cancelable: false }
            );
        }
    };

    const isLeader = leaderId === userId;
    const handleDishbandGroup = async () => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn giải tán nhóm?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Xác nhận',
                    onPress: async () => {
                        try {
                            await groupApi.handleGroups(`/deleteGroup/${groupId}`, {}, 'DELETE');
                            socket.emit("groupDeleted", {
                                groupId,
                                members: members.map((member) => member._id),
                            });
                            navigation.navigate('Tin nhắn');
                        } catch (error) {
                            console.log('Failed to disband group: ', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };


    return (
        <ScrollView style={globalStyles.container}>
            <HeaderComponent
                style={{
                    flexDirection: "row",
                    backgroundColor: COLORS.primary,
                    height: APPINFOS.sizes.HEIGHT * 0.06,
                    alignItems: "center",
                    paddingLeft: 16,
                }}
                title="Tuỳ chọn"
                onBackPress={() => navigation.goBack()}
                fontFamily={"medium"}
                color={COLORS.white}
                size={18}
            />

            <View style={styles.avatar}>
                <Avatar.Image
                    size={100}
                    source={groupImg ? { uri: groupImg } : defaultAvatar}
                />
            </View>
            <TextComponent text={groupName} style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }} />
            <View style={styles.inputsContainer}>
                <View style={styles.buttonheader}>
                    <Ionicons name="notifications" size={20} color={COLORS.black} />
                    <TextComponent text="Thông báo" style={{ fontSize: 12 }} />
                </View>
                <View style={styles.buttonheader}>
                    <Ionicons name="search" size={20} color={COLORS.black} />
                    <TextComponent text="Tìm tin nhắn" style={{ fontSize: 12 }} />
                </View>

                <TouchableOpacity onPress={handleAddMember}>
                    <View style={styles.buttonheader}>
                        <Ionicons name="add-sharp" size={20} color={COLORS.black} />
                        <TextComponent text="Thêm thành viên" style={{ fontSize: 12 }} />
                    </View>
                </TouchableOpacity>


                <View style={styles.buttonheader}>
                    <Ionicons name="folder-outline" size={20} color={COLORS.black} />
                    <TextComponent text="Đổi hình nền" style={{ fontSize: 12 }} />
                </View>
            </View>

            <View style={styles.container}>
                <TouchableOpacity onPress={{}}>
                    <View style={styles.inpuButton}>
                        <Ionicons name="folder-open-outline" size={24} color={COLORS.black} />
                        <TextComponent text="Ảnh, file, link đã gửi" style={{ fontSize: 16 }} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={{}}>
                    <View style={styles.inpuButton}>
                        <Ionicons name="calendar-number-outline" size={24} color={COLORS.black} />
                        <TextComponent text="Lịch nhóm" style={{ fontSize: 16 }} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={{}}>
                    <View style={styles.inpuButton}>
                        <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.black} />
                        <TextComponent text="Tin nhắn đã ghim" style={{ fontSize: 16 }} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={{}}>
                    <View style={styles.inpuButton}>
                        <Ionicons name="barcode-outline" size={24} color={COLORS.black} />
                        <TextComponent text="Bình chọn" style={{ fontSize: 16 }} />
                    </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={handleShowMember}>
                    <View style={styles.inpuButton}>
                        <Ionicons name="people-outline" size={24} color={COLORS.black} />
                        <TextComponent text="Thành viên" style={{ fontSize: 16 }} />
                    </View>
                </TouchableOpacity>

                {isLeader && (
                    <TouchableOpacity onPress={handleDishbandGroup}>
                        <View style={styles.inpuButton}>
                            <Ionicons name="people-outline" size={24} color={COLORS.black} />
                            <TextComponent text="Giải tán nhóm" style={{ fontSize: 16 }} />
                        </View>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={handleLeaveGroup}>
                    <View style={styles.inpuButton}>
                        <Ionicons name="log-out-outline" size={24} color={COLORS.black} />
                        <TextComponent text="Rời nhóm" style={{ fontSize: 16 }} />
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    inputsContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
    },
    avatar: {
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 16,
    },

    buttonheader: {
        flexDirection: 'column',
        alignItems: 'center',

        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
    inpuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
    },
});

export default SettingChat;
