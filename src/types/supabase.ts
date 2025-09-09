export type Database = {
  public: {
    Tables: {
      buyback_models: {
        Row: { id: string; brand: string; model: string; base_price: number };
      };
      buyback_quotes: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string;
          brand: string;
          model: string;
          condition: "excellent" | "good" | "fair" | "poor";
          estimated_price_inr: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["buyback_quotes"]["Row"], "id" | "created_at">;
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          level: string | null;
          price_inr: number | null;
        };
      };
      enrollments: {
        Row: {
          id: string;
          course_id: string;
          name: string;
          email: string | null;
          phone: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["enrollments"]["Row"], "id" | "created_at">;
      };
      videos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          youtube_id: string;
          published_at: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          cover_image_url: string | null;
          published_at: string;
          status: "draft" | "published";
        };
      };
      repair_orders: {
        Row: {
          id: string;
          device_category: string;
          brand: string;
          model: string;
          issue: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          description: string | null;
          status: "pending" | "in_progress" | "completed" | "cancelled";
          tracking_code: string;
          estimated_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["repair_orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["repair_orders"]["Insert"]>;
      };
    };
  };
};
