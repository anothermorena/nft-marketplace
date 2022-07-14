//1. import all requred components and constants
//==============================================
import { TouchableOpacity, Text, Image } from "react-native";
import { COLORS, SIZES, FONTS, SHADOWS } from "./../constants";

export const CircleButton = ({ imgUrl, handlePress,handleAddNftToWishList, ...props }) => {
  return (
    <TouchableOpacity
      style={{
        width: 40,
        height: 40,
        backgroundColor: COLORS.white,
        position: "absolute",
        borderRadius: SIZES.extraLarge,
        alignItems: "center",
        justifyContent: "center",
        ...SHADOWS.light,
        ...props,
      }}
      onPress={handleAddNftToWishList ? handleAddNftToWishList : handlePress}
    >
      <Image
        source={imgUrl}
        resizeMode="contain"
        style={{ width: 24, height: 24 }}
      />
    </TouchableOpacity>
  );
};


export const RectButton = ({ minWidth, fontSize, onPress,buttonText, ...props }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: COLORS.brand,
        padding: SIZES.small,
        borderRadius: SIZES.font,
        minWidth: minWidth,
        ...props,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: fontSize,
          color: COLORS.white,
          textAlign: "center",
        }}
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};