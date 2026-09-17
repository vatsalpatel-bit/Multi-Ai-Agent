import axios from "axios"

export const getUserMessagesApi = async (userId) => {
    try {
        const res = await axios.get(`${process.env.CHAT_SERVICE_URL}/api/v1/chat/get/m/${userId}`)
        return res.data;
    } catch (error) {
        console.log(error);
        console.log("get messages api error");
    }
}