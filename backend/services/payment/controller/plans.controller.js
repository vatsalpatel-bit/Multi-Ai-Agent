import Plans from "../models/plans.model.js";

export const getPlans = async (req, res) => {
    try {

        const userId = req.headers["x-user-id"];
        const userType = req.headers["x-user-type"];

        if (!userId || !userType) {
            return res.status(401).json({
                success: false,
                message: "User identity is required"
            });
        }

        const plans = await Plans.find().lean();

        if (!plans || plans.length === 0) {
            return res.status(404).json({ success: false, message: 'Plans not found' });
        };

        return res.status(200).json(plans);

    } catch (error) {
        console.error("Get plans error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getPlanById = async (req, res) => {
    try {

        const userId = req.headers["x-user-id"];
        const userType = req.headers["x-user-type"];

        if (!userId || !userType) {
            return res.status(401).json({
                success: false,
                message: "User identity is required"
            });
        }

        const planId = req.params.id;
        console.log(planId)
        if (!planId) {
            return res.status(404).json({ success: false, message: 'PlanId not found' });
        };

        const plan = await Plans.findById(planId);
        console.log(plan);

        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        return res.status(200).json(plan);

    } catch (error) {
        console.error("Get plans error", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}
