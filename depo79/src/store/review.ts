import { create } from "zustand";
import axios from "axios";

// Define the types for the review and store state
interface Review {
    _id: string;
    user: string;
    product: string;
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
            const response = await axios.get("/api/review");
            if (response.data.success) {  // Add check for success
                set({ 
                    reviews: response.data.reviews,
                    loading: false 
                });
                console.log("Reviews fetched:", response.data.reviews); // Debug log
            } else {
                throw new Error(response.data.message || "Failed to fetch reviews");
            }
        } catch (error: unknown) {
            console.error("Error fetching reviews:", error);
            let message = "Failed to fetch reviews";
            if (error instanceof Error) {
                message = error.message;
            }
            set({
                loading: false,
                error: message,
                reviews: [], // Reset reviews on error
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
