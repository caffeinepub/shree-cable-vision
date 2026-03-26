import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Inquiry {
    serviceRequired: string;
    name: string;
    timestamp: Time;
    phone: string;
    location: string;
}
export type Time = bigint;
export interface backendInterface {
    getAllInquiries(): Promise<Array<Inquiry>>;
    submitInquiry(name: string, phone: string, location: string, serviceRequired: string): Promise<void>;
}
