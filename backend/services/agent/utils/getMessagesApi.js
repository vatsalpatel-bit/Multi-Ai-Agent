import axios from "axios"

export const getMessagesApi = async (conversationId) => {
    try {
        const res = await axios.get(`${process.env.CHAT_SERVICE_URL}/api/v1/chat/get/m/${conversationId}`)
        return res.data;
    } catch (error) {
        console.log(error);
        console.log("get messages api error");
    }
}