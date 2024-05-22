import { Text, TextInput, View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import TextComponent from "../../components/TextComponent";
import { COLORS, APPINFOS } from "../../constants";
import { globalStyles } from "../../styles/globalStyle";
import ButtonComponent from "../../components/ButtonComponent";
import HeaderComponent from "../../components/HeaderComponet";
import authApi from "../../apis/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addAuth } from "../../redux/reducers/authReducer";
import { useDispatch } from "react-redux";
import LoadingModal from "../../modals/LoadingModal";
import { validate } from "../../utils/validate";

const initValues = {
  password: "",
  confirmPassword: "",
};
const UpdatePasswordScreen = ({ navigation, route }) => {
  const email = route?.params?.email;
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

  const dispatch = useDispatch();
  const handlePasswordRetrieval = async () => {
    const { password, confirmPassword } = values;
    
    if (!password) {
      setErrorMessage("Mật khẩu không được để trống");
      return;
    } else if (!validate.password(password)) {
      setErrorMessage(
        "mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một ký tự đặc biệt và tổng cộng ít nhất 8 ký tự"
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      return;
    }
    setErrorMessage("");
    const api = `/password-retrieval`;
    // setIsLoading(true);
    const data = {
      email: email,
      password: password,
    };
    console.log(data);

    try {
      const res = await authApi.handleAuthencation(api, data, "post");
      dispatch(addAuth(res.data));
      await AsyncStorage.setItem("auth", JSON.stringify(res.data));
      setIsLoading(false);
    } catch (error) {
      setErrorMessage("User has already exist!!!");
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
        title="Đăng nhập"
        fontFamily={"medium"}
        onBackPress={onBackPress}
        color={COLORS.white}
        size={18}
      />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.gray3,
          height: APPINFOS.sizes.HEIGHT * 0.06,
          marginBottom: 20,
        }}
      >
        <TextComponent
          text="Nhập mật khẩu mới"
          size={16}
          fontFamily="medium"
          style={{ marginRight: 20 }}
        />
      </View>
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          secureTextEntry={true}
          onChangeText={(value) => handleChange("password", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry={true}
          onChangeText={(value) => handleChange("confirmPassword", value)}
        />
        {errorMessage && (
        <TextComponent
          text={errorMessage}
          size={16}
          color={COLORS.red}
          fontFamily="medium"
        />
      )}
      </View>
      <View style={styles.buttonContainer}>
        <ButtonComponent
          type={"primary"}
          icon={"arrow-forward"}
          width={APPINFOS.sizes.WIDTH * 0.2}
          height={APPINFOS.sizes.HEIGHT * 0.1}
          borderRadius={APPINFOS.sizes.WIDTH * 0.2}
          onPress={handlePasswordRetrieval}
        />
      </View>
      
      <LoadingModal isVisible={isLoading} />
    </View>
  );
};

export default UpdatePasswordScreen;

const styles = StyleSheet.create({
  inputsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginRight: 20,
    marginBottom: 20,
  },
  input: {
    borderColor: COLORS.gray2,
    borderBottomWidth: 1,
    width: APPINFOS.sizes.WIDTH * 0.9,
    height: APPINFOS.sizes.HEIGHT * 0.04,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
});
