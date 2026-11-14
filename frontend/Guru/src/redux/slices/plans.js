import { createSlice } from "@reduxjs/toolkit";

const plansSlice = createSlice({
    name: "plans",
    initialState: {
        allPlans: [],
        singlePlan: null,
    },
    reducers: {
        setAllPlans: (state, action) => {
            state.allPlans = action.payload
        },
        setSinglePlan: (state, action) => {
            state.singlePlan = action.payload
        }
    }
});

export const { setAllPlans, setSinglePlan } = plansSlice.actions;
export default plansSlice.reducer;
