import { create } from "zustand";
import axios from "axios";

// Define the types for the review and store state
interface Review {
    _id: string;
    user: {
        _id: string;
        nama: string;
        nomorhp?: string;
    };
    product: {
        _id: string;
        nama: string;
    };
    userName: string;    // Add this field
    productName: string; // Add this field
    rating: number;
    comment: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

interface ReviewStore {
    reviews: Review[];
    loading: boolean;
    error: string | null;
    fetchReviews: () => Promise<void>;
    fetchReviewById: (id: string) => Promise<Review | null>;
}

export const useReviewStore = create<ReviewStore>((set) => ({
    reviews: [],
    loading: false,
    error: null,

    // Fetch all reviews
    fetchReviews: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch("/api/review/all");
            if (!response.ok) {
                throw new Error("Failed to fetch reviews");
            }
            const data = await response.json();
            if (data.success) {
                set({ 
                    reviews: data.reviews,
                    loading: false 
                });
            } else {
                throw new Error(data.message);
            }
        } catch (error: unknown) {
            console.error("Error fetching reviews:", error);
            set({
                loading: false,
                error: error instanceof Error ? error.message : "Failed to fetch reviews",
                reviews: []
            });
        }
    },

    // Fetch a single review by ID
    fetchReviewById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`api/review/${id}`);
            set({ loading: false });
            return response.data.review;
        } catch (error: Error | unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            set({
                loading: false,
                error: axiosError.response?.data?.message || "Failed to fetch the review",
            });
            return null;
        }
    },
}));
