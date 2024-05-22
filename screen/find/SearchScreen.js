import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { findUserByEmail, userSelector, sendFriendRequest } from '../../redux/reducers/userReducer';
import { authSelector } from '../../redux/reducers/authReducer';
import { Avatar, Icon } from 'react-native-paper';
import { COLORS } from '../../constants';

const SearchScreen = () => {
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector(userSelector);
    const auth = useSelector(authSelector);

    const handleSearch = () => {
        try {
            dispatch(findUserByEmail(searchText));
            return user;
            A
            console.log(user)
        } catch (error) {
            console.log("khong tim thấy user");
        }
    };







    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm"
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearch}
                />
                <Icon name="search" size={24} color="#ccc" />
            </View>
            {loading && <ActivityIndicator style={styles.loadingIndicator} size="large" color={COLORS.primary} />}
            {error && <Text style={styles.errorText}>Đã xảy ra lỗi: {error.message}</Text>}

            {user && (
                <View style={styles.userList}>
                    <View style={styles.userItem}>
                        <Avatar.Image size={50} source={{ uri: user.avatar }} />
                        <Text style={styles.userEmail}>{user.fullname}</Text>
                        <TouchableOpacity style={styles.inputRequest} onPress={() => dispatch(sendFriendRequest({ senderId: auth.id, receiverId: user._id }))}>
                            <Text style={{ color: 'white' }}>Kết bạn</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        backgroundColor: '#007AFF',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        flexDirection: 'row',

    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        width: '100%',

    },
    userItem: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
    },
    userEmail: {
        fontSize: 16,
        marginLeft: 16,
    },
    loadingIndicator: {
        marginTop: 16,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 24,
    },
    userList: {
        flex: 1,
        marginTop: 16,
        marginHorizontal: 16,
    },
    inputRequest: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 8,
        marginLeft: 150,
    },
});

export default SearchScreen;
