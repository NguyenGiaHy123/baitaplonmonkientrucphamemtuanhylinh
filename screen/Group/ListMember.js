

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import TextComponent from "../../components/TextComponent";
import { COLORS, APPINFOS } from "../../constants";
import HeaderComponent from "../../components/HeaderComponet";
import { useNavigation } from '@react-navigation/native';
import groupApi from '../../apis/groupApi';
import defaultAvatar from "../../assets/images/user.png";
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducer';
import { io } from 'socket.io-client';

const ListMember = ({ route }) => {
    const socket = io(`${APPINFOS.BASE_URL}`)
    const navigation = useNavigation();
    const groupId = route.params.groupId;

    const user = useSelector(authSelector);
    const userId = user.id;

    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Xử lý sự kiện khi trao quyền trưởng nhóm
    useEffect(() => {
        console.log("members", members);
        socket.on("updateLeader", (memberId) => {
            console.log("Received updateLeader event:", memberId);
            setMembers((prevMembers) =>
                prevMembers.map((member) => {
                    if (member._id === memberId) {
                        return { ...member, role: "leader" };
                    }
                    if (member.role === "leader") {
                        return { ...member, role: "member" };
                    }
                    return member;
                })
            );
        });

        return () => {
            socket.off("updateLeader");
        };
    }, [socket, members]);

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
        socket.on('removeMember', (removedMemberId) => {
            setMembers(members.filter(member => member._id !== removedMemberId));

        });

    }, [handleMakeCoLeader, handleMakeLeader, handleRemoveMember]);

    const handleMemberPress = (memberId) => {
        setSelectedMember(memberId);
        setIsPopupVisible(true);
    }

    const handleRemoveMember = async () => {
        // Xử lý xoá thành viên
        try {
            const response = await groupApi.handleGroups(`/${groupId}/removeMember`,
                {
                    memberIds: [selectedMember]
                },
                "DELETE");
            console.log('kiem tra response', response)
            const updatedMembers = members.filter(member => member._id !== selectedMember);
            setMembers(updatedMembers);
            setIsPopupVisible(false);
            socket.emit("groupDeleted", {
                groupId,
                members: members.map((member) => member._id),
            });
        } catch (error) {
            Alert.alert('Thông báo', 'Nhóm phải có ít nhất 2 thành viên');
        }
    }

    const handleMakeLeader = async () => {
        // Xử lý làm trưởng nhóm
        try {
            await groupApi.handleGroups(`/${groupId}/transferOwnership/${selectedMember}`,
                {
                },
                "PUT");
            const updatedMembers = members.map(member => {
                if (member._id === selectedMember) {
                    return { ...member, role: 'leader' };
                }
                if (member.role === 'leader') {
                    return { ...member, role: 'member' };
                }
                return member;
            });
            setMembers(updatedMembers);
            setIsPopupVisible(false);
            socket.emit("leaderMade", {
                groupId,
                memberId: selectedMember,
            });
        } catch (error) {
            console.error(error);
        }
    }

    const handleMakeCoLeader = async () => {
        // Xử lý làm phó nhóm
        try {
            await groupApi.handleGroups(`/set-co-leader/${groupId}/${selectedMember}`,
                {
                }, "PUT");
            const updatedMembers = members.map(member => {
                if (member._id === selectedMember) {
                    return { ...member, role: 'coLeader' };
                }
                return member;
            });
            setMembers(updatedMembers);
            setIsPopupVisible(false);

        } catch (error) {
            console.error(error);
            Alert.alert('Thông báo', 'Mỗi nhó chỉ có thể có 2 nhóm phó ');
        }
    }



    const isLeader = members.some(member => member._id === userId && member.role === 'leader');
    const isCoLeader = members.some(member => member._id === userId && member.role === 'coLeader');
    const isMember = !isLeader && !isCoLeader;


    const leaderIndex = members.findIndex(member => member.role === 'leader');
    const leader = members[leaderIndex];
    const otherMembers = members.filter(member => member.role !== 'leader');

    // Sắp xếp danh sách thành viên còn lại theo thứ tự chữ cái của tên
    const sortedMembers = otherMembers.sort((a, b) => a.fullName.localeCompare(b.fullName));

    // Nếu leader tồn tại, đặt leader lên đầu danh sách
    const sortedMembersWithLeader = leader ? [leader, ...sortedMembers] : sortedMembers;

    return (
        <View style={styles.container}>
            <HeaderComponent
                onBackPress={() => navigation.navigate('SettingChat', {
                    groupId,
                    groupName: route.params.groupName,
                    groupImg: route.params.groupImg,
                })}
                title="Danh sách thành viên"
                style={{
                    flexDirection: "row",
                    backgroundColor: COLORS.primary,
                    height: APPINFOS.sizes.HEIGHT * 0.06,
                    alignItems: "center",
                    paddingLeft: 16,
                }}
                fontFamily={"medium"}
                color={COLORS.white}
                size={18}
            />
            <View style={styles.memberList}>
                <TextComponent text="Danh sách thành viên" style={styles.title} />

                <FlatList
                    data={sortedMembersWithLeader}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.memberItem,
                                (item.role === 'leader' || item.role === 'coLeader') && styles.leaderItem,
                            ]}
                            onPress={() => handleMemberPress(item._id)}
                        >
                            <Image source={item.avatar ? { uri: item.avatar } : defaultAvatar} style={styles.avatar} />
                            <Text style={styles.memberName}>{item.fullName}</Text>
                            {(item.role === 'leader' || item.role === 'coLeader') && (
                                <Text style={styles.memberRole}>{item.role}</Text>
                            )}
                        </TouchableOpacity>
                    )}
                />

            </View>

            <MemberPopup
                visible={isPopupVisible}
                onClose={() => setIsPopupVisible(false)}
                member={selectedMember}
                onRemoveMember={handleRemoveMember}
                onMakeLeader={handleMakeLeader}
                onMakeCoLeader={handleMakeCoLeader}
                showMakeLeader={isLeader}
                showMakeCoLeader={isLeader}
                showRemoveMember={isLeader || isCoLeader}
            />
        </View>
    );
};

const MemberPopup = ({ visible, onClose, member, onRemoveMember, onMakeLeader, onMakeCoLeader, showMakeLeader, showMakeCoLeader, showRemoveMember }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.popupContainer}>
                <View style={styles.popup}>
                    <Text style={styles.popupTitle}>Tùy chọn</Text>
                    {showMakeLeader && (
                        <TouchableOpacity style={styles.popupOption} onPress={onMakeLeader}>
                            <Text style={styles.popupOptionText}>Làm trưởng nhóm</Text>
                        </TouchableOpacity>
                    )}
                    {showMakeCoLeader && (
                        <TouchableOpacity style={styles.popupOption} onPress={onMakeCoLeader}>
                            <Text style={styles.popupOptionText}>Làm phó nhóm</Text>
                        </TouchableOpacity>
                    )}
                    {showRemoveMember && (
                        <TouchableOpacity style={styles.popupOption} onPress={onRemoveMember}>
                            <Text style={styles.popupOptionText}>Xoá thành viên</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.popupOption} onPress={onClose}>
                        <Text style={styles.popupOptionText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    memberList: {
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.black,
        marginBottom: 10,
    },
    memberItem: {
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray5,
    },
    memberName: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    leaderItem: {
        backgroundColor: COLORS.lightSkyBlue,
        color: COLORS.white,

    },
    memberRole: {
        color: COLORS.white,
        marginLeft: 'auto',
        marginRight: 10,
    },
    popupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popup: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 20,
    },
    popupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    popupOption: {
        paddingVertical: 10,
    },
    popupOptionText: {
        fontSize: 16,
    },
});

export default ListMember;
