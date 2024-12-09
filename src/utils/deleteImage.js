import fetchApi from "./helper";

const deleteImage = async ({ data }) => {
    try {
        const response = await fetchApi({ url: `https://api-2y60.onrender.com/image`, method: "DELETE", isAuthRequired: true, data: data })
        return response;
    } catch (error) {

    }
};

export default deleteImage;