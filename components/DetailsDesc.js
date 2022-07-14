//1. import all requred hooks, constants and components
import { useState } from "react";
import { View, Text } from "react-native";
import { EthPrice, NFTTitle } from "./SubInfo";
import { COLORS, SIZES, FONTS } from "./../constants";

const DetailsDesc = ({ data }) => {
  const [text, setText] = useState(data.nft_description.slice(0, 100));
  const [readMore, setReadMore] = useState(false);

  return (
    <>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <NFTTitle
          title={data.nft_title}
          subTitle={data.creator}
          titleSize={SIZES.extraLarge}
          subTitleSize={SIZES.font}
        />

        <EthPrice price={data.nft_price} />
      </View>

      <View style={{ marginVertical: SIZES.extraLarge * 1.5 }}>
        <Text
          style={{
            fontSize: SIZES.font,
            fontFamily: FONTS.semiBold,
            color: COLORS.primary,
          }}
        >
          Description
        </Text>
        <View
          style={{
            marginTop: SIZES.base,
          }}
        >
          <Text
            style={{
              color: COLORS.secondary,
              fontSize: SIZES.small,
              fontFamily: FONTS.regular,
              lineHeight: SIZES.large,
            }}
          >
            {text}
            {!readMore && "..."}
            <Text
              style={{
                color: COLORS.primary,
                fontSize: SIZES.small,
                fontFamily: FONTS.semiBold,
              }}
              onPress={() => {
                if (!readMore) {
                  setText(data.nft_description);
                  setReadMore(true);
                } else {
                  setText(data.nft_description.slice(0, 100));
                  setReadMore(false);
                }
              }}
            >
              {readMore ? " Show Less" : " Read More"}
            </Text>
          </Text>
        </View>
      </View>
    </>
  );
};

export default DetailsDesc;