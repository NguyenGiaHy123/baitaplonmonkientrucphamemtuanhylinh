import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { authSelector } from "../../redux/reducers/authReducer";
import { useSelector } from "react-redux";
import { Avatar } from 'react-native-paper';
import { COLORS, APPINFOS } from "../../constants";
import HeaderComponent from '../../components/HeaderComponet';
import { globalStyles } from '../../styles/globalStyle';
import TextComponent from '../../components/TextComponent';
import { Ionicons } from '@expo/vector-icons';


const UserScreen = ({ navigation }) => {
    const user = useSelector(authSelector);
    const handleSettings = () => {
        navigation.navigate('SettingScreen', { user });
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
                settings={handleSettings}
                fontFamily="medium"
                color={COLORS.white}
                size={18}

            />

            <View style={styles.Avatar}>
                <Avatar.Image
                    size={50}
                    source={user.photoUrl ? { uri: user.photoUrl } : require('../../assets/images/user.png')}
                />
                <View style={{ marginLeft: 16 }}>
                    <Text style={styles.name}>{user.fullname}</Text>
                    <TextComponent text={"Xem trang cá nhân"} size={16} />
                </View>
            </View>
            <View style={{ backgroundColor: COLORS.gray5, height: 5 }}>

            </View>
            <View style={styles.OptionButton}>
                <Ionicons name='musical-notes' size={24} color={COLORS.primary} />
                <View style={styles.Option}>
                    <TextComponent text={"Cài đặt nhạc chờ"} size={16} />
                    <TextComponent text={"Chọn bài hát yêu thích của bạn"} size={14} />
                </View>
            </View>

            <View style={styles.OptionButton}>
                <Ionicons name='wallet' size={24} color={COLORS.primary} />
                <View style={styles.Option}>
                    <TextComponent text={"Ví QR"} size={16} />
                    <TextComponent text={"Lưu trữ và xuât trình các mã QR quan trọng"} size={14} />
                </View>
            </View>

            <View style={styles.OptionButton}>
                <Ionicons name='cloud' size={24} color={COLORS.primary} />
                <View style={styles.Option}>
                    <TextComponent text={"Cloud của tôi"} size={16} />
                    <TextComponent text={"Lưu trữ tin nhắn quan trọng"} size={14} />
                </View>
            </View>

            <View style={styles.OptionButton}>
                <Ionicons name='document-text' size={24} color={COLORS.primary} />
                <View style={styles.Option}>
                    <TextComponent text={"Dung lượng và dữ liệu"} size={16} />
                    <TextComponent text={"Quản lý dữ liệu Zelo của bạn"} size={14} />
                </View>
            </View>

            <View style={styles.OptionButton}>
                <Ionicons name='lock-closed' size={24} color={COLORS.primary} />
                <View style={styles.Option}>
                    <TextComponent text={"Tài khoản và bảo mật"} size={16} />

                </View>
            </View>
            <View style={styles.OptionButton}>
                <Ionicons name='shield-checkmark' size={24} color={COLORS.primary} />
                <View style={styles.Option}>
                    <TextComponent text={"Quyền riêng tư"} size={16} />

                </View>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({

    Avatar: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        borderRadius: 10,
        margin: 16,
        alignItems: "center",

    },
    OptionButton: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        borderRadius: 10,
        marginLeft: 16,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray5,
        padding: 16
    },
    Option: {
        marginLeft: 16,
    },

});

export default UserScreen;
