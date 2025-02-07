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
    fetchUnreviewedProducts: (checkoutId: string, userId: string) => Promise<any>; // Add this line
    createReview: (data: {
        user: string;
        checkout: string;
        product: string;
        rating: number;
        comment: string;
    }) => Promise<Review>;
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

    // Fetch unreviewed products for a specific checkout
    fetchUnreviewedProducts: async (checkoutId: string, userId: string) => {
        set({ loading: true, error: null });
        try {
            console.log('Fetching unreviewed:', checkoutId, userId); // Debug log
            const response = await fetch(`/api/review/unreviewed/${checkoutId}?userId=${userId}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch unreviewed products');
            }
            
            if (!data.success) {
                throw new Error(data.message);
            }
            
            set({ loading: false });
            return data.unreviewedProducts;
        } catch (error) {
            console.error("Error fetching unreviewed products:", error);
            set({
                loading: false,
                error: error instanceof Error ? error.message : "Failed to fetch unreviewed products",
            });
            return [];
        }
    },

    // Create a new review
    createReview: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('/api/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Failed to create review');
            }

            if (!result.success) {
                throw new Error(result.message);
            }

            set({ loading: false });
            return result.review;
        } catch (error) {
            console.error("Error creating review:", error);
            set({
                loading: false,
                error: error instanceof Error ? error.message : "Failed to create review"
            });
            throw error;
        }
    }
}));
