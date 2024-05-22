import React, { useState } from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";
import Swiper from "react-native-swiper";
import { globalStyles } from "../../styles/globalStyle";
import { APPINFOS, COLORS } from "../../constants";
import ButtonComponent from "../../components/ButtonComponent";
import { useNavigation } from "@react-navigation/native";

const OnbroadingScreen = () => {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  return (
    <View style={[globalStyles.container]}>
      <Swiper
        loop={false}
        onIndexChanged={(num) => setIndex(num)}
        index={index}
        activeDotColor={COLORS.primary}
        style={{ height: APPINFOS.sizes.HEIGHT * 0.79}}
      >
        <Image
          source={require("../../assets/images/onboarding-1.jpg")}
          style={{
            width: APPINFOS.sizes.WIDTH,
            height: APPINFOS.sizes.HEIGHT * 0.9,
            resizeMode: "contain",
          }}
        />
        <Image
          source={require("../../assets/images/onboarding-2.jpg")}
          style={{
            width: APPINFOS.sizes.WIDTH,
            height: APPINFOS.sizes.HEIGHT * 0.9,
            resizeMode: "contain",
          }}
        />
        <Image
          source={require("../../assets/images/onboarding-3.jpg")}
          style={{
            width: APPINFOS.sizes.WIDTH,
            height: APPINFOS.sizes.HEIGHT * 0.9,
            resizeMode: "contain",
          }}
        />
        <Image
          source={require("../../assets/images/onboarding-4.jpg")}
          style={{
            width: APPINFOS.sizes.WIDTH,
            height: APPINFOS.sizes.HEIGHT * 0.9,
            resizeMode: "contain",
          }}
        />
        <Image
          source={require("../../assets/images/onboarding-5.jpg")}
          style={{
            width: APPINFOS.sizes.WIDTH,
            height: APPINFOS.sizes.HEIGHT * 0.9,
            resizeMode: "contain",
          }}
        />
      </Swiper>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <ButtonComponent type={'primary'} title="Đăng nhập" onPress={() => navigation.navigate("LoginScreen")} />
        <ButtonComponent type={'primary'} title="Tạo tài khoản mới" onPress={() => navigation.navigate("SignUpScreen")} />
      </View>
    </View>
  );
};

export default OnbroadingScreen;
