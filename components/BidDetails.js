//1. import all requred constants and components
//==============================================
import { EthPrice } from "./SubInfo";
import { View, Text, Image } from "react-native";
import { COLORS, SIZES, FONTS } from "./../constants";

const BidDetails = ({ bid }) => {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: SIZES.base,
        paddingHorizontal: SIZES.base * 2,
      }}
      key={bid.bid_id}
    >
      <Image
        source={{uri: bid.bidder_image}}
        resizeMode="contain"
        style={{ width: 48, height: 48, borderRadius: 30,borderWidth:2, borderColor:COLORS.brand }}
      />

      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: SIZES.base,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.semiBold,
            fontSize: SIZES.small,
            color: COLORS.primary,
          }}
        >
          Bid placed by {bid.bidder}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: SIZES.small - 2,
            color: COLORS.secondary,
            marginTop: 3,
          }}
        >
          {bid.date_created}
        </Text>
      </View>

      <EthPrice price={bid.bid_amount} />
    </View>
  );
};

export default BidDetails;