 //Helper functions file
 //=====================
 
 //1.search nft's
 export const handleSearch = (data,keyword) => {
    const filteredData = data.filter((item) =>
      item.nft_title.toLowerCase().includes(keyword.toLowerCase())
    );

    if (filteredData.length !== 0) setSearchResults(filteredData);
  };


//2. add nft to wish list
handleAddNftToWishList = async () => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    const response = await axios.post("/api/add_nft_to_wish_list/", JSON.stringify({ user_ip_address: userIpAddress, nft_id: data.nft_id }), config);
    const { message } = response.data;
    //give the user feedback
    alert(message);

    //update the wish list context with the new nft count
    const newWishListData = {
      ...wishListData,
      nftWishListCount: nftWishListCount + 1     
  }
  setWishListData(newWishListData);

  } catch (error) {
    alert('An error occurred. Check your network and try again');
  }

}

 