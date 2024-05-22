import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { useDispatch } from "react-redux";
import { authSelector, removeAuth, updateUserInfo } from "../../redux/reducers/authReducer";
import { useSelector } from "react-redux";
import { Avatar } from 'react-native-paper';
import { COLORS, APPINFOS } from "../../constants";
import HeaderComponent from '../../components/HeaderComponet';
import { globalStyles } from '../../styles/globalStyle';
import TextComponent from '../../components/TextComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import ButtonComponent from '../../components/ButtonComponent';

const InfoScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(authSelector);
    console.log("Thong tin user", user);


    console.log("Thong tin user la hinh ag", user.photoUrl);



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
                title="Thông tin tài khoản"
                fontFamily="medium"
                color={COLORS.white}
                onBackPress={() => navigation.goBack()}
                size={18}
            />

            <View style={styles.avatar}>
                <Avatar.Image
                    size={100}
                    source={user.photoUrl ? { uri: user.photoUrl } : require('../../assets/images/user.png')}
                />
            </View>


            <View style={styles.showInput}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="user" size={24} color={COLORS.primary} />
                    <TextComponent text="Tên zalo" style={{ marginLeft: 8 }} />
                </View>
                <TextComponent style={styles.name} text={user.fullname} />
            </View>

            <View style={styles.showInput}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name='envelope' size={24} color={COLORS.primary} />
                    <TextComponent text="Email" style={{ marginLeft: 8 }} />
                </View>
                <TextComponent style={styles.name} text={user.email} />
            </View>


            <View style={styles.showInput}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name='birthday-cake' size={24} color={COLORS.primary} />
                    <TextComponent text="Ngày sinh" style={{ marginLeft: 8 }} />
                </View>
                <TextComponent style={styles.name} text={user.dateOfBirth} />
            </View>

            <View style={styles.showInput}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name='venus-mars' size={24} color={COLORS.primary} />
                    <TextComponent text="Giới tính" style={{ marginLeft: 8 }} />
                </View>
                <TextComponent style={styles.name} text={user.gender} />
            </View>

            <View style={styles.ButtonComponent}>

                <ButtonComponent
                    title='Chỉnh sửa'
                    onPress={() => navigation.navigate('EditScreen')}
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

    avatar: {
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 16,
    },

    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    showInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray5,
    },
    ButtonComponent: {
        alignItems: 'center',
    }

});

export default InfoScreen;
