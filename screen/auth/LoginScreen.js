import { TextInput, View, StyleSheet } from "react-native";
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
import { validate } from "../../utils/validate";
import { io } from 'socket.io-client';

const socket = io(`${APPINFOS.BASE_URL}`);

const initValues = {
  email: "",
  password: "",
};

const LoginScreen = ({ navigation }) => {
  const onBackPress = () => {
    navigation.goBack();
  };

  const [values, setValues] = useState(initValues);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (values.password || values.email) {
      setErrorMessage("");
    }
  }, [values.email, values.password]);

  const handleChange = (key, value) => {
    setValues({ ...values, [key]: value });
  };

  const dispatch = useDispatch();
  const handleLogin = async () => {
    const { email, password } = values;

    if (!email.trim() && !password.trim()) {
      setErrorMessage("Vui lòng nhập email và mật khẩu");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Email không được để trống");
      return;
    } else if (!validate.email(email)) {
      setErrorMessage("Email không hợp lệ");
      return;
    }

    if (!password) {
      setErrorMessage("Mật khẩu không được để trống");
      return;
    }

    try {
      const response = await authApi.handleAuthencation(
        "/login",
        {
          email: email,
          password: password,
        },
        "POST"
      );

      dispatch(addAuth(response.data));
      await AsyncStorage.setItem("auth", JSON.stringify(response.data));
      console.log(response.data);
      if (response.data && response.data.id) {
        
      } else {
        console.error('No userId in response data:', response.data);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Email hoặc mật khẩu không đúng");
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
        }}
      >
        <TextComponent
          text="Vui lòng nhập email và mật khẩu để đăng nhập"
          size={16}
          fontFamily="medium"
          style={{ marginRight: 20 }}
        />
      </View>
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(value) => handleChange("email", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={true}
          onChangeText={(value) => handleChange("password", value)}
        />
        {errorMessage && (
          <TextComponent
            text={errorMessage}
            size={14}
            color={COLORS.red}
            fontFamily="medium"
          />
        )}
      </View>

      <ButtonComponent
        title="Lấy lại mật khẩu"
        type={"link"}
        color={COLORS.primary}
        textStyles={{ marginLeft: 22 }}
        onPress={() => navigation.navigate("PasswordRetrievalScreen")}
      />
      <View style={styles.buttonContainer}>
        <ButtonComponent
          type={"primary"}
          icon={"arrow-forward"}
          width={APPINFOS.sizes.WIDTH * 0.2}
          height={APPINFOS.sizes.HEIGHT * 0.1}
          borderRadius={APPINFOS.sizes.WIDTH * 0.2}
          onPress={handleLogin}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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

export default LoginScreen;
