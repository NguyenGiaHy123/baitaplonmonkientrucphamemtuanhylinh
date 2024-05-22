import React from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, TextInput } from 'react-native';
import { authSelector, removeAuth, updateUserInfo } from "../../redux/reducers/authReducer";
import { useSelector } from "react-redux";
import { Avatar } from 'react-native-paper';
import { COLORS, APPINFOS } from "../../constants";
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { globalStyles } from '../../styles/globalStyle';
import HeaderComponent from '../../components/HeaderComponet';
import ButtonComponent from '../../components/ButtonComponent';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';



const SettingScreen = () => {

    const dispatch = useDispatch();
    const user = useSelector(authSelector);
    const [fullname, setFullname] = useState(user.fullname);
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl);


    const navigation = useNavigation();

    const handleInfos = () => {
        navigation.navigate('InfoScreen', { user });
    }

    const handlePassword = () => {
        navigation.navigate('ChangePasswordScreen');
    }

    const handleLogout = () => {
        dispatch(removeAuth({}));
    }


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
                title="Cài đặt "
                fontFamily="medium"
                color={COLORS.white}
                onBackPress={() => navigation.goBack()}
                size={18}
            />
            <View style={styles.optionButton}>
                <TouchableOpacity style={styles.option} onPress={handleInfos}>
                    <Text style={styles.optionText}>Thông tin tàI khoản</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={handlePassword}>
                    <Text style={styles.optionText}>Thay đổi mật khẩu</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={handleLogout}>
                    <Text style={styles.optionText}>Đăng xuất</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    option: {
        padding: 12,
        backgroundColor: COLORS.lightGray,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.gray5,
        width: '100%',
        alignItems: 'center',
    },

    optionText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionButton: {
        marginTop: 16,
        width: '100%',
        padding: 16,
    }

});

export default SettingScreen;