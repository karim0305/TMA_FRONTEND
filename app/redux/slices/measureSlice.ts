import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Measurement Interface (based on your Mongoose schema)
export interface Measurement {
  
  _id?: string;
  UserId: string | { _id: string };
  name: string;
  customerId: string | { _id: string };
  date: string;
  Chest?: string;
  Waist?: string;
  Length?: string;
  Hips?: string;
  Shoulder?: string;
  Sleeve?: string;
  Bicep?: string;
  Wrist?: string;
  Neck?: string;
  Armhole?: string;
  TrouserWaist?: string;
  TrouserLength?: string;
  Thigh?: string;
  Knee?: string;
  Bottom?: string;
  Inseam?: string;
  Rise?: string;
  WaistcoatLength?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MeasurementState {
  list: Measurement[];
  loading: boolean;
  error: string | null;
}

const initialState: MeasurementState = {
  list: [],
  loading: false,
  error: null,
};

const measurementSlice = createSlice({
  name: "measurements",
  initialState,
  reducers: {
    setMeasurements: (state, action: PayloadAction<Measurement[]>) => {
      state.list = action.payload;
    },
    addMeasurement: (state, action: PayloadAction<Measurement>) => {
      state.list.push(action.payload);
    },
    updateMeasurement: (state, action: PayloadAction<Measurement>) => {
      state.list = state.list.map((m) =>
        m._id === action.payload._id ? action.payload : m
      );
    },
    deleteMeasurement: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((m) => m._id !== action.payload);
    },
    setMeasurementLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setMeasurementError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMeasurements,
  addMeasurement,
  updateMeasurement,
  deleteMeasurement,
  setMeasurementLoading,
  setMeasurementError,
} = measurementSlice.actions;

export default measurementSlice.reducer;
