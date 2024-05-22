import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, TextInput } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { authSelector, updatePassword, addAuth } from "../../redux/reducers/authReducer";
import { COLORS, APPINFOS } from "../../constants";
import HeaderComponent from '../../components/HeaderComponet';
import { globalStyles } from '../../styles/globalStyle';
import ButtonComponent from '../../components/ButtonComponent';
import authApi from './../../apis/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initValues = {
    password: "",
    confirmPassword: "",
    oldPassword: "",
};

const ChangePasswordScreen = ({ navigation }) => {
    const user = useSelector(authSelector);
    const dispatch = useDispatch();
    // const [oldPassword, setOldPassword] = useState('');
    // const [newPassword, setNewPassword] = useState('');
    // const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const email = user.email;
    const [values, setValues] = useState(initValues);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (values.password || values.confirmPassword) {
            setErrorMessage("");
        }
    }, [values.confirmPassword, values.password]);

    const handleChange = (key, value) => {
        setValues({ ...values, [key]: value });
    };
    const onBackPress = () => {
        navigation.goBack();
    };

    const handleUpdatePassword = async () => {
        const { password, confirmPassword } = values;
        if (!password) {
            setErrorMessage("Mật khẩu không được để trống");
            return;
        } else if (password.length < 6) {
            setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }
        if (!values.oldPassword) {
            setErrorMessage("Mật khẩu cũ không được để trống");
            return;
        }
        if (password === values.oldPassword) {
            setErrorMessage("Mật khẩu mới không được trùng với mật khẩu cũ");
            return;
        }
        if (!confirmPassword) {
            setErrorMessage("Xác nhận mật khẩu không được để trống");
            return;
        }
        if (confirmPassword.length < 6) {
            setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }


        if (password !== confirmPassword) {
            setErrorMessage("Mật khẩu không khớp nhau");
            return;
        }
        setErrorMessage("");
        const api = '/update-password-when-login';
        setIsLoading(true);
        const data = {
            email,
            password: password,
            confirmPassword: confirmPassword,
        };

        try {
            const res = await authApi.handleAuthencation(api, data, "post");
            dispatch(addAuth(res.data));
            await AsyncStorage.setItem("auth", JSON.stringify(res.data));
            setIsLoading(false);
            Alert.alert("Thành công", "Đổi mật khẩu thành công", [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]);
            navigation.goBack();

        } catch (error) {
            setErrorMessage("User has already exist!!!");
            console.log(`Can not create new user ${error}`);
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
                    justifyContent: "space-between",
                }}
                title="Thay đổi mật khẩu"
                fontFamily="medium"
                onBackPress={() => navigation.goBack()}
                color={COLORS.white}
                size={18}
            />

            <View style={styles.inputsContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Mật khẩu cũ'
                    secureTextEntry={true}
                    onChangeText={(value) => handleChange("oldPassword", value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Mật khẩu mới'
                    secureTextEntry={true}
                    onChangeText={(value) => handleChange("password", value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Nhập lại mật khẩu mới'

                    secureTextEntry={true}
                    onChangeText={(value) => handleChange("confirmPassword", value)}
                />
            </View>

            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: COLORS.red, fontSize: 20 }}>{errorMessage}</Text>
            </View>



            <View style={{ marginTop: 20, alignItems: 'center' }}>
                <ButtonComponent
                    title="Lưu"
                    onPress={handleUpdatePassword}
                    type={'primary'}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    inputsContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    input: {
        borderColor: COLORS.gray2,
        borderBottomWidth: 1,
        width: APPINFOS.sizes.WIDTH * 0.9,
        height: APPINFOS.sizes.HEIGHT * 0.05,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
    },
});

export default ChangePasswordScreen;
