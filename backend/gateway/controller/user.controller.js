export const getCurrentUserApi = async (req, res) => {
    try {
        // console.log("Start")
        // console.log(req.user)
        return res.status(200).json(req.user);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}