import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Checkbox, RadioButton } from "react-native-paper";
import TextComponent from "../../components/TextComponent";
import ButtonComponent from "../../components/ButtonComponent";
import HeaderComponent from "../../components/HeaderComponet";
import LoadingModal from "../../modals/LoadingModal";
import authApi from "../../apis/authApi";
import { COLORS, APPINFOS } from "../../constants";
import { globalStyles } from "../../styles/globalStyle";
import { validate } from "../../utils/validate";

const SignUpScreen = ({ navigation }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [values, setValues] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (
      values.password ||
      values.confirmPassword ||
      values.email ||
      values.fullname ||
      termsAccepted
    ) {
      setErrorMessage("");
    }
  }, [
    values.confirmPassword,
    values.email,
    values.fullname,
    values.password,
    termsAccepted,
  ]);

  const handleChange = (key, value) => {
    setValues({ ...values, [key]: value });
  };

  const handleSignUp = async () => {
    const { fullname, email, password, confirmPassword } = values;

    // Kiểm tra dữ liệu đầu vào
    if (!validate.fullname(fullname)) {
      setErrorMessage(
        "Tên phải có ít nhất hai từ, không chứa số và không chứa ký tự đặc biệt"
      );
      return;
    }
    if (!validate.email(email)) {
      setErrorMessage("Email không hợp lệ");
      return;
    }

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

    if (!termsAccepted) {
      setErrorMessage("Bạn phải chấp nhận điều khoản");
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

      if (emailExistsResponse.message !== "Email không tồn tại") {
        setErrorMessage("Email đã được đăng ký");
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
        }}
      >
        <TextComponent
          text="Đăng ký tài khoản Zelo"
          size={20}
          fontFamily="medium"
          style={{ justifyContent: "center", alignItems: "center" }}
        />
      </View>
      <View style={styles.inputsContainer}>
        <TextInput
          style={[styles.input, { marginTop: 20 }]}
          placeholder="Full name"
          onChangeText={(value) => handleChange("fullname", value)}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry={true}
          onChangeText={(value) => handleChange("confirmPassword", value)}
        />
        <RadioButton.Group
          onValueChange={(value) => handleChange("gender", value)}
          value={values.gender}
        >
          <View style={{ flexDirection: "row", justifyContent:"flex-start" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="male" />
              <TextComponent text="Male" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="female" />
              <TextComponent text="Female" />
            </View>
          </View>
        </RadioButton.Group>
        {errorMessage && (
          <TextComponent
            text={errorMessage}
            size={16}
            color={COLORS.red}
            fontFamily="medium"
          />
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: APPINFOS.sizes.WIDTH * 0.94,
            marginVertical: 20,
          }}
        >
          <Checkbox
            status={termsAccepted ? "checked" : "unchecked"}
            onPress={() => setTermsAccepted(!termsAccepted)}
            color={COLORS.primary}
          />
          <TextComponent
            text="Tôi đồng ý với điều khoản sử dụng của Zelo"
            size={16}
            color={COLORS.primary}
            fontFamily="medium"
          />
        </View>
        <ButtonComponent
          type={"primary"}
          title="Tiếp tục"
          onPress={handleSignUp}
        />
      </View>
      <LoadingModal isVisible={isLoading} />
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  inputsContainer: {
    justifyContent: "center",
    alignItems: "center",
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
