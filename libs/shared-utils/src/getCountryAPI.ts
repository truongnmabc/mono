import { requestGetData } from "@shared-services";

 const getCountryAPI = async () => {
    let getCountry;
    try {
        getCountry = await requestGetData({
            url: "https://us-east4-micro-enigma-235001.cloudfunctions.net/get-country",
        });
    } catch (error) {
        console.log("error", error);
    }
    return getCountry;
};

export default getCountryAPI;
