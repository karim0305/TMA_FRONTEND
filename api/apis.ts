//const baseUrl = "http://localhost:3010/tmaapi";
const baseUrl = "https://tma-backend-liart.vercel.app/tmaapi";



export const AuthApi = {
  Login: `${baseUrl}/auth/login`,
  ForgotPasswordSendOtp: `${baseUrl}/auth/forgot/send-otp`,
  ForgotPasswordVerifyOtp: `${baseUrl}/auth/forgot/verify-otp`,
  ForgotPasswordReset: `${baseUrl}/auth/forgot/reset`,
};



export const UserApi = {
  addUser: `${baseUrl}/users`,
  getUsers: `${baseUrl}/users`,
  getUser: (id: string) => `${baseUrl}/users/${id}`,
  updateUser: (id: string) => `${baseUrl}/users/${id}`,
  deleteUser: (id: string) => `${baseUrl}/users/${id}`,
};


export const MeasurementApi = {
  addMeasurement: `${baseUrl}/measurements`,
  getMeasurements: `${baseUrl}/measurements`,
  updateMeasurement: (id: string) => `${baseUrl}/measurements/${id}`,
  deleteMeasurement: (id: string) => `${baseUrl}/measurements/${id}`,
};


export const SuitBookingApi = {
  addBooking: `${baseUrl}/suit-bookings`,
  getBookings: `${baseUrl}/suit-bookings`,
  getBookingswithname: `${baseUrl}/suit-bookings/with-user`,
  updateBooking: (id: string) => `${baseUrl}/suit-bookings/${id}`,
  deleteBooking: (id: string) => `${baseUrl}/suit-bookings/${id}`,
};

