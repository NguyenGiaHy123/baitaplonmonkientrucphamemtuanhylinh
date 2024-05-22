import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import HeaderComponent from '../../components/HeaderComponet';
import { COLORS, APPINFOS } from "../../constants";
import { globalStyles } from "../../styles/globalStyle";
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import ButtonComponent from '../../components/ButtonComponent';

const DetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { contact } = route.params;


    return (
        <View style={globalStyles.container}>
            <HeaderComponent
                style={styles.header}
                title="Chi tiết liên hệ"
                fontFamily={"medium"}
                onBackPress={() => navigation.goBack()}
                color={COLORS.white}
                size={18}
            />
            <View style={styles.detailsContainer}>
                <Avatar.Image size={100} source={{ uri: contact.photoUrl }} style={styles.contactImage} />
                <View style={styles.buttonContainer}>
                    <Text style={styles.name}>Tên: {contact.fullname}</Text>
                </View>
                <Text style={styles.info}>Giới tính: {contact.gender}</Text>
                <Text style={styles.info}>Ngày sinh: {contact.dateOfBirth}</Text>
                <Text style={styles.info}>Email: {contact.email}</Text>

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        backgroundColor: COLORS.primary,
        height: APPINFOS.sizes.HEIGHT * 0.06,
        alignItems: "center",
        paddingLeft: 16,
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 20,
        marginTop: 20,
    },
    contactImage: {
        marginBottom: 20,
        alignSelf: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: COLORS.black,

    },
    info: {
        fontSize: 18,
        color: 'gray',
        marginBottom: 5,
    },
    editButton: {
        backgroundColor: COLORS.primary,
        width: APPINFOS.sizes.WIDTH * 0.4,
        height: APPINFOS.sizes.HEIGHT * 0.06,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    deleteButton: {
        backgroundColor: COLORS.red,
        width: APPINFOS.sizes.WIDTH * 0.4,
        height: APPINFOS.sizes.HEIGHT * 0.06,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
    },
});

export default DetailsScreen;
