import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import TextComponent from "../../components/TextComponent";
import ButtonComponent from "../../components/ButtonComponent";
import HeaderComponent from "../../components/HeaderComponet";
import LoadingModal from "../../modals/LoadingModal";
import authApi from "../../apis/authApi";
import { COLORS, APPINFOS } from "../../constants";
import { globalStyles } from "../../styles/globalStyle";
import { validate } from "../../utils/validate";


const initValues = {
  email: "",
};

const PasswordRetrievalScreen = ({ navigation }) => {
  const [values, setValues] = useState(initValues);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (values.email) {
      setErrorMessage("");
    }
  }, [values.email]);

  const handleChange = (key, value) => {
    setValues({ ...values, [key]: value });
  };

  const handleCodePasswordRetrieval = async () => {
    const { email } = values;
    if (!validate.email(email)) {
      setErrorMessage("Email không hợp lệ");
      return;
    }

    setErrorMessage("");

    setIsLoading(true);
    try {
      const emailExistsResponse = await authApi.handleAuthencation(
        "/check-email-exists",
        { email: values.email },
        "post"
      );

      if (emailExistsResponse.message !== "Email đã tồn tại") {
        setErrorMessage("Email chưa được đăng ký");
        setIsLoading(false);
        return;
      }

      const res = await authApi.handleAuthencation(
        "/verification",
        { email: values.email },
        "post"
      );
      navigation.navigate("VerificationScreen", {
        code: res.data.code,
        ...values,
        fromPasswordRetrieval: true,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(`Can not send verification code ${error}`);
      setIsLoading(false);
    }
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={globalStyles.container}>
      <HeaderComponent
        style={{
          flexDirection: "row",
          height: APPINFOS.sizes.HEIGHT * 0.06,
          alignItems: "center",
          paddingLeft: 16,
          justifyContent: "space-between",
        }}
        onBackPress={onBackPress}
      />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: APPINFOS.sizes.HEIGHT * 0.06,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <TextComponent
          text="Nhập email để lấy lại mật khẩu"
          size={16}
          fontFamily="medium"
          style={{ justifyContent: "center", alignItems: "center" }}
        />
      </View>
      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(value) => handleChange("email", value)}
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
          onPress={handleCodePasswordRetrieval}
        />
      </View>
      <LoadingModal isVisible={isLoading} />
    </View>
  );
};

export default PasswordRetrievalScreen;

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
