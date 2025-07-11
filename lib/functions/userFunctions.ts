"use server";
import { User, UserInsert, dbRowToUser, userToDbUpdate } from "../db-schemas";
import { createClient as createServerClient } from "../supabase/server";

export interface BasicResult {
  success: boolean;
  error?: string;
}

export interface UserResult extends BasicResult {
  user?: User;
}

/**
 * Creates a new user document in the Supabase 'users' table.
 * It ensures that a user has either an email or a phone number, but not both.
 * @param uid The unique identifier of the user, typically from Supabase Auth.
 * @param userData An object containing the user's email, phone number, and display name.
 * @returns A promise that resolves to a UserResult object. On success, it includes the newly created user. On failure, it includes an error message.
 */
export const createUserDocument = async (
  uid: string,
  userData: {
    email: string | null;
    phoneNumber: string | null;
    displayName: string | null;
  }
): Promise<UserResult> => {
  const supabase = await createServerClient();
  try {
    const { email, phoneNumber } = userData;
    if ((email && phoneNumber) || (!email && !phoneNumber)) {
      return {
        success: false,
        error:
          "A user must have either an email or a phone number, but not both.",
      };
    }

    const now = new Date().toISOString();

    const newUserData: UserInsert = {
      id: uid,
      email: userData.email || null,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("users")
      .insert([newUserData])
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to create user document",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "No data returned from user creation",
      };
    }

    return {
      success: true,
      user: dbRowToUser(data),
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create user document",
    };
  }
};

/**
 * Retrieves a user document from the Supabase 'users' table.
 * @param uid The unique identifier of the user.
 * @returns A promise that resolves to a UserResult object. On success, it includes the user data. On failure, it includes an error message.
 */
export const getUserDocument = async (uid: string): Promise<UserResult> => {
  const supabase = await createServerClient();
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", uid)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          success: false,
          error: "User document not found",
        };
      }
      return {
        success: false,
        error: error.message || "Failed to get user document",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "User document not found",
      };
    }

    return {
      success: true,
      user: dbRowToUser(data),
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get user document",
    };
  }
};

/**
 * Updates a user document in the Supabase 'users' table.
 * It validates that the update does not result in a user having both or neither an email and a phone number.
 * @param uid The unique identifier of the user to update.
 * @param updates An object containing the user properties to update.
 * @returns A promise that resolves to a BasicResult object indicating success or failure.
 */
export const updateUserDocument = async (
  uid: string,
  updates: Partial<User>
): Promise<BasicResult> => {
  const supabase = await createServerClient();
  try {
    const currentUserResult = await getUserDocument(uid);
    if (!currentUserResult.success || !currentUserResult.user) {
      return {
        success: false,
        error: "Failed to get user document for update validation.",
      };
    }

    const updateData = userToDbUpdate(updates);

    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", uid);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to update user document",
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update user document",
    };
  }
};

/**
 * Ensures a user document exists in Supabase.
 * If the user document doesn't exist, it creates one.
 * If it exists, it checks for and applies any necessary updates from the auth data (email, phone, display name).
 * @param uid The unique identifier of the user.
 * @param userData An object containing the user's current auth data (email, phone number, display name).
 * @returns A promise that resolves to a UserResult object, containing the user data.
 */
export const ensureUserDocument = async (
  uid: string,
  userData: {
    email: string | null;
    phoneNumber: string | null;
    displayName: string | null;
  }
): Promise<UserResult> => {
  try {
    const existingUserResult = await getUserDocument(uid);

    if (existingUserResult.success && existingUserResult.user) {
      const updates: Partial<User> = {};

      if (Object.keys(updates).length > 0) {
        const updateResult = await updateUserDocument(uid, updates);
        if (!updateResult.success) {
          console.error(
            "Failed to update user document with new auth data:",
            updateResult.error
          );
          return existingUserResult;
        }
        return getUserDocument(uid);
      }

      return existingUserResult;
    }

    if (existingUserResult.error === "User document not found") {
      const newUser = await createUserDocument(uid, userData);
      return newUser;
    }

    return existingUserResult;
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to ensure user document",
    };
  }
};
