import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { globalStyles } from "../../styles/globalStyle";
import HeaderComponent from "../../components/HeaderComponet";
import { APPINFOS, COLORS } from "../../constants";
import TextComponent from "../../components/TextComponent";
import LoadingModal from "../../modals/LoadingModal";
import { useEffect, useRef } from "react";
import ButtonComponent from "../../components/ButtonComponent";
import authApi from "../../apis/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addAuth } from "../../redux/reducers/authReducer";
import { useDispatch } from "react-redux";


const VerificationScreen = ({ navigation, route }) => {
  const code = route?.params?.code;
  const email = route?.params?.email;
  const password = route?.params?.password;
  const fullname = route?.params?.fullname;
  const gender = route?.params?.gender;
  const fromPasswordRetrieval = route?.params?.fromPasswordRetrieval;

  const [isLoading, setIsLoading] = useState(false);
  const [codeValue, setCodeValue] = useState([]);
  const [limit, setLimit] = useState(60);
  const [currentCode, setCurrentCode] = useState(code);
  const [newCode, setNewCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onBackPress = () => {
    navigation.goBack();
  };
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    ref1.current.focus();
  }, []);

  useEffect(() => {
    let item = ``;
    codeValue.forEach((element) => {
      item += element;
    });
    setNewCode(item);
  }, [codeValue]);

  useEffect(() => {
    if (limit > 0) {
      const interval = setInterval(() => {
        setLimit((limit) => limit - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [limit]);

  const handleResendVerification = async () => {
    const api = `/verification`;
    setIsLoading(true);
    try {
      const res = await authApi.handleAuthencation(api, { email }, "post");

      setLimit(60);
      setCurrentCode(res.data.code);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(`Can not send verification code ${error}`);
    }
  };
  const navigateToUpdatePasswword = () => {
    if (limit > 0) {
      if (parseInt(newCode) !== parseInt(currentCode)) {
        setErrorMessage("Invalid code!!!");
      } else {
        setErrorMessage("");
        navigation.navigate("UpdatePasswordScreen", { email });
      }
    } else {
      setErrorMessage("Time out verification code, please resend new code!!!");
    }

  };

  const handleVerification = async () => {
    if (limit > 0) {
      if (parseInt(newCode) !== parseInt(currentCode)) {
        setErrorMessage("Invalid code!!!");
      } else {
        setErrorMessage("");

        const api = `/register`
        const data = {
          email,
          password: password,
          fullname: fullname,
          gender: gender
        };
        console.log(data);

        try {
          const res = await authApi.handleAuthencation(api, data, "post");
          dispatch(addAuth(res.data));
          await AsyncStorage.setItem("auth", JSON.stringify(res.data));
        } catch (error) {
          setErrorMessage("User has already exist!!!");
        }
      }
    } else {
      setErrorMessage("Time out verification code, please resend new code!!!");
    }
  };

  const hanhdleChangeCode = (val, index) => {
    const data = [...codeValue];
    data[index] = val;
    setCodeValue(data);
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
      <View style={{ padding: 20 }}>
        <TextComponent text={`Verification Code`} fontWeight="bold" size={20} />
        <TextComponent
          text={`We send a verification code to your email: ${email.replace(
            /(.{5})([^@]*)(@.*)/,
            "*****$2$3"
          )} `}
          size={16}
        />
        <View style={styles.codeContainer}>
          <TextInput
            ref={ref1}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(val) => {
              hanhdleChangeCode(val, 0);
              val.length > 0 && ref2.current.focus();
            }}
          />
          <TextInput
            ref={ref2}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(val) => {
              hanhdleChangeCode(val, 1);
              val.length > 0 && ref3.current.focus();
            }}
          />
          <TextInput
            ref={ref3}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(val) => {
              hanhdleChangeCode(val, 2);
              val.length > 0 && ref4.current.focus();
            }}
          />
          <TextInput
            ref={ref4}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(val) => {
              hanhdleChangeCode(val, 3);
            }}
          />
        </View>
      </View>

      <View style={{ alignItems: "center", marginTop: 10 }}>
        <ButtonComponent
          type={"primary"}
          title={"Verify"}
          onPress={
            fromPasswordRetrieval
              ? navigateToUpdatePasswword
              : handleVerification
          }
        />
      </View>
      <View style={{ alignItems: "center", marginTop: 10 }}>
        {errorMessage.length > 0 && (
          <TextComponent text={errorMessage} color={COLORS.red} size={16} />
        )}
      </View>
      <View style={{ alignItems: "center", marginTop: 14 }}>
        {limit > 0 ? (
          <TextComponent text={`Resend code in ${limit} seconds`} size={16} />
        ) : (
          <ButtonComponent
            title="Resend Email Verification"
            type={"link"}
            color={COLORS.primary}
            textStyles={{ marginLeft: 22 }}
            textFont={16}
            onPress={handleResendVerification}
            isLink={true}
            linkColor={COLORS.primary}
          />
        )}
      </View>

      <LoadingModal isVisible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
  },
});

export default VerificationScreen;
