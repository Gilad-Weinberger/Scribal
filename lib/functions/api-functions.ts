// API Client for Scribal - Replaces all function files

// Auth API
export const authAPI = {
  signIn: async (email: string, password: string) => {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  signUp: async (email: string, password: string, displayName: string) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    });
    return response.json();
  },

  signOut: async () => {
    const response = await fetch("/api/auth/signout", {
      method: "POST",
    });
    return response.json();
  },
};

// User API
export const userAPI = {
  getCurrentUser: async () => {
    const response = await fetch("/api/users");
    return response.json();
  },

  createUser: async (
    email: string | null,
    phoneNumber: string | null,
    displayName: string | null
  ) => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phoneNumber, displayName }),
    });
    return response.json();
  },

  updateUser: async (updates: Record<string, unknown>) => {
    const response = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  ensureUser: async (
    email: string | null,
    phoneNumber: string | null,
    displayName: string | null
  ) => {
    const response = await fetch("/api/users/ensure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phoneNumber, displayName }),
    });
    return response.json();
  },

  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/users/profile-picture", {
      method: "POST",
      body: formData,
    });
    return response.json();
  },
};

// Documents API
export const documentsAPI = {
  getAllDocuments: async () => {
    const response = await fetch("/api/documents");
    return response.json();
  },

  createDocument: async (data: {
    title: string;
    prompt: string;
    requirements?: string;
    writingStyleId?: string;
  }) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error:
            errorData.error ||
            `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        return {
          success: false,
          error: "Request timed out. Please try again.",
        };
      }
      throw error;
    }
  },

  getDocument: async (id: string) => {
    const response = await fetch(`/api/documents/${id}`);
    return response.json();
  },

  updateDocument: async (
    id: string,
    updates: {
      isFavorite?: boolean;
      type?: string;
      title?: string;
      content?: string;
    }
  ) => {
    const response = await fetch(`/api/documents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  deleteDocument: async (id: string) => {
    const response = await fetch(`/api/documents/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  checkWritingStyles: async () => {
    const response = await fetch("/api/documents/check-writing-styles");
    return response.json();
  },
};

// Writing Styles API
export const writingStylesAPI = {
  getAllWritingStyles: async () => {
    const response = await fetch("/api/writing-styles");
    return response.json();
  },

  createWritingStyle: async (name: string, files: FileList) => {
    const formData = new FormData();
    formData.append("name", name);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    const response = await fetch("/api/writing-styles", {
      method: "POST",
      body: formData,
    });
    return response.json();
  },

  getWritingStyle: async (id: string) => {
    const response = await fetch(`/api/writing-styles/${id}`);
    return response.json();
  },

  updateWritingStyle: async (id: string, updates: { styleName: string }) => {
    const response = await fetch(`/api/writing-styles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  deleteWritingStyle: async (id: string) => {
    const response = await fetch(`/api/writing-styles/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  getWritingStylesForSelection: async () => {
    const response = await fetch("/api/writing-styles/selection");
    return response.json();
  },
};

// Feedbacks API
export const feedbacksAPI = {
  getAllFeedbacks: async () => {
    const response = await fetch("/api/feedbacks");
    return response.json();
  },

  createFeedback: async (data: {
    title: string;
    description: string;
    category: "feature" | "bug";
  }) => {
    const response = await fetch("/api/feedbacks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  },

  getFeedback: async (id: string) => {
    const response = await fetch(`/api/feedbacks/${id}`);
    return response.json();
  },

  updateFeedback: async (
    id: string,
    updates: {
      title?: string;
      description?: string;
      category?: "feature" | "bug";
      status?: "open" | "in_progress" | "completed" | "closed";
    }
  ) => {
    const response = await fetch(`/api/feedbacks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json();
    return result;
  },

  deleteFeedback: async (id: string) => {
    const response = await fetch(`/api/feedbacks/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  upvoteFeedback: async (id: string) => {
    const response = await fetch(`/api/feedbacks/${id}/upvote`, {
      method: "POST",
    });
    return response.json();
  },

  removeUpvote: async (id: string) => {
    const response = await fetch(`/api/feedbacks/${id}/upvote`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// Feedback Comments API
export const feedbackCommentsAPI = {
  getComments: async (feedbackId: string) => {
    const response = await fetch(`/api/feedbacks/${feedbackId}/comments`);
    return response.json();
  },

  createComment: async (feedbackId: string, content: string) => {
    const response = await fetch(`/api/feedbacks/${feedbackId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    return response.json();
  },

  updateComment: async (feedbackId: string, commentId: string, content: string) => {
    const response = await fetch(`/api/feedbacks/${feedbackId}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    return response.json();
  },

  deleteComment: async (feedbackId: string, commentId: string) => {
    const response = await fetch(`/api/feedbacks/${feedbackId}/comments/${commentId}`, {
      method: "DELETE",
    });
    return response.json();
  },

  likeComment: async (feedbackId: string, commentId: string) => {
    const response = await fetch(`/api/feedbacks/${feedbackId}/comments/${commentId}/like`, {
      method: "POST",
    });
    return response.json();
  },

  unlikeComment: async (feedbackId: string, commentId: string) => {
    const response = await fetch(`/api/feedbacks/${feedbackId}/comments/${commentId}/like`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// Client-side helper functions (replacing client function files)
export const clientHelpers = {
  // Document creation helper
  processDocumentCreation: async (data: {
    title: string;
    prompt: string;
    requirements?: string;
    writingStyleId?: string;
  }) => {
    try {
      // Enhanced validation
      if (!data.title.trim()) {
        return {
          success: false,
          error: "Please provide a title for your document",
        };
      }

      if (data.title.trim().length < 3) {
        return {
          success: false,
          error: "Document title must be at least 3 characters long",
        };
      }

      if (!data.prompt.trim()) {
        return {
          success: false,
          error: "Please provide a prompt for your document",
        };
      }

      if (data.prompt.trim().length < 10) {
        return {
          success: false,
          error:
            "Please provide a more detailed prompt (at least 10 characters)",
        };
      }

      // Validate requirements if provided
      if (data.requirements && data.requirements.trim().length > 1000) {
        return {
          success: false,
          error: "Requirements must be less than 1000 characters",
        };
      }

      const result = await documentsAPI.createDocument(data);

      if (!result.success || !result.document) {
        return {
          success: false,
          error: result.error || "Failed to create document",
        };
      }

      return {
        success: true,
        documentId: result.document.id,
      };
    } catch (error: unknown) {
      console.error("Error in processDocumentCreation:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process document creation",
      };
    }
  },

  // Writing style creation helper
  processWritingStyleCreation: async (data: {
    name: string;
    files: FileList | null;
  }) => {
    try {
      if (!data.files || data.files.length === 0) {
        return {
          success: false,
          error: "Please upload at least one .txt file",
        };
      }

      // Validate file types
      for (let i = 0; i < data.files.length; i++) {
        const file = data.files[i];
        if (!file.name.toLowerCase().endsWith(".txt")) {
          return {
            success: false,
            error: `File "${file.name}" is not a .txt file. Please upload only .txt files.`,
          };
        }
      }

      const result = await writingStylesAPI.createWritingStyle(
        data.name,
        data.files
      );

      if (!result.success || !result.writingStyle) {
        return {
          success: false,
          error: result.error || "Failed to create writing style",
        };
      }

      return {
        success: true,
        writingStyleId: result.writingStyle.id,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process writing style creation",
      };
    }
  },

  // Feedback creation helper
  processFeedbackCreation: async (data: {
    title: string;
    description: string;
    category: "feature" | "bug";
  }) => {
    try {
      // Enhanced validation
      if (!data.title.trim()) {
        return {
          success: false,
          error: "Please provide a title for your feedback",
        };
      }

      if (data.title.trim().length < 3) {
        return {
          success: false,
          error: "Feedback title must be at least 3 characters long",
        };
      }

      if (!data.description.trim()) {
        return {
          success: false,
          error: "Please provide a description for your feedback",
        };
      }

      if (data.description.trim().length < 10) {
        return {
          success: false,
          error:
            "Please provide a more detailed description (at least 10 characters)",
        };
      }

      const result = await feedbacksAPI.createFeedback(data);

      if (!result.success || !result.feedback) {
        return {
          success: false,
          error: result.error || "Failed to create feedback",
        };
      }

      return {
        success: true,
        feedbackId: result.feedback.id,
      };
    } catch (error: unknown) {
      console.error("Error in processFeedbackCreation:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process feedback creation",
      };
    }
  },

  // Auth state change helper
  handleAuthStateChange: async (session: {
    user?: {
      id: string;
      email?: string | null;
      phone?: string | null;
      user_metadata?: { display_name?: string | null };
    } | null;
  }) => {
    if (session?.user) {
      const { user: authUser } = session;
      const userData = {
        email: authUser.email ?? null,
        phoneNumber: authUser.phone ?? null,
        displayName: authUser.user_metadata?.display_name ?? null,
      };

      const result = await userAPI.ensureUser(
        userData.email,
        userData.phoneNumber,
        userData.displayName
      );

      if (result.success && result.user) {
        return result.user;
      } else {
        console.error("Failed to ensure user document:", result.error);
        return null;
      }
    }
    return null;
  },
};
