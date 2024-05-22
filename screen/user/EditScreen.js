import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Modal, Button } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { Avatar, RadioButton } from 'react-native-paper';
import { addAuth, authSelector } from "../../redux/reducers/authReducer";
import { COLORS, APPINFOS } from "../../constants";
import HeaderComponent from '../../components/HeaderComponet';
import { globalStyles } from '../../styles/globalStyle';
import TextComponent from '../../components/TextComponent';
import DatePicker from 'react-native-modern-datepicker';
import { getToday, getFormatedDate } from 'react-native-modern-datepicker';
import ButtonComponent from '../../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
// import axios from 'axios';
import authApi from '../../apis/authApi';
import * as ImagePicker from 'expo-image-picker';

const EditScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(authSelector);
    const userId = user.id;
    const [errorMessage, setErrorMessage] = useState("");

    const [values, setValues] = useState({
        email: user.email,
        fullname: user.fullname,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender
    });

    const handleChange = (key, value) => {
        setValues(prevState => ({
            ...prevState,
            [key]: value
        }));
    };


    const handleUpdate = async () => {
        const { fullname, email, selectedDate, gender } = values;

        const api = `/updateProfile`;
        const data = {
            fullname: fullname,
            dateOfBirth: selectedDate,
            gender: gender,
            email: email,
            photoUrl: image,
        };

        try {
            const res = await authApi.handleAuthencation(api, data, "put");
            dispatch(addAuth(res.data));
            await AsyncStorage.setItem("auth", JSON.stringify(res.data));
            navigation.navigate("InfoScreen");
        } catch (error) {
            setErrorMessage("User has already exist!!!");
        }
    };


    const formattedDate = moment(values.selectedDate, 'YYYY/MM/DD').toDate();
    const formatDate = getFormatedDate(formattedDate, 'DD-MM-YYYY');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


    const [image, setImage] = useState(null);
    const pickImage = async (userId) => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

            if (!result.canceled) {
                const formData = new FormData();
                formData.append("file", {
                    uri: result.assets[0].uri,
                    type: "image/jpeg",
                    name: "test.jpg",
                });

                const response = await fetch(`${APPINFOS.BASE_URL}/users/upload/${userId}`, {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                const fileUrl = data.fileUrl;
                setImage(fileUrl);
                console.log('fileUrl', fileUrl)
            }
        } catch (error) {
            console.error(error);
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

                }}
                title="Chỉnh sửa thông tin"
                fontFamily="medium"
                onBackPress={() => navigation.goBack()}
                color={COLORS.white}
                size={18}
            />

            <TouchableOpacity style={styles.avatar} onPress={pickImage}>
                {image ? (
                    <Avatar.Image size={100} source={{ uri: image }} />
                ) : (
                    <Avatar.Image
                        size={100}
                        source={
                            user.photoUrl
                                ? { uri: user.photoUrl }
                                : require('../../assets/images/user.png')
                        }
                    />
                )}
            </TouchableOpacity>

            <View style={styles.showInput}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextComponent text="Tên zalo" size={16} style={{ marginLeft: 8 }} />
                </View>
                <TextInput
                    style={styles.name}
                    value={values.fullname}
                    onChangeText={(text) => handleChange('fullname', text)}
                />
            </View>

            <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                <View style={styles.showInput}>
                    <TextComponent text="Ngày sinh" size={16} style={{ marginLeft: 8 }} />
                    <TextComponent text={formatDate} style={{ marginLeft: 8 }} />
                </View>
            </TouchableOpacity>

            <Modal
                visible={isDatePickerVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setDatePickerVisibility(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <DatePicker
                            mode="calendar"
                            date={values.selectedDate}
                            onDateChange={(date) => {
                                setValues({ ...values, selectedDate: date });
                                setDatePickerVisibility(false);
                            }}
                        />
                        <Button title="Done" onPress={() => setDatePickerVisibility(false)} />
                    </View>
                </View>
            </Modal>

            <View style={styles.showInput}>
                <RadioButton.Group
                    onValueChange={(value) => handleChange("gender", value)}
                    value={values.gender}
                >
                    <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <RadioButton value="Nam" />
                            <TextComponent text="Nam" />
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <RadioButton value="Nữ" />
                            <TextComponent text="Nữ" />
                        </View>
                    </View>
                </RadioButton.Group>
            </View>

            <View style={styles.ButtonComponent}>
                <ButtonComponent
                    onPress={handleUpdate}
                    type={'primary'}
                    title="Lưu"
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
    avatar: {
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 16,
    },
    name: {
        fontSize: 18,
        marginTop: 8,
    },
    showInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        width: APPINFOS.sizes.WIDTH * 0.9,
        borderRadius: 8,
        marginLeft: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray5,
    },
    ButtonComponent: {
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
});

export default EditScreen;
