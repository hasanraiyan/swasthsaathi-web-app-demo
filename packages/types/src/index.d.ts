export type UserRole = 'patient' | 'doctor' | 'admin' | 'caregiver';
export interface IUser {
    _id: string;
    clerkId: string;
    email: string;
    name: string;
    role: UserRole;
    phone?: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}
export interface IPatientProfile {
    _id: string;
    userId: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    allergies?: string[];
    medicalConditions?: string[];
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
}
export interface IApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}
