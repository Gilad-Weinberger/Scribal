import { useEffect, useState } from "react";
import { User } from "@/lib/db-schemas";
import { subscribeToUserDocument } from "@/lib/functions/userFunctions.client";

const useRealtimeUser = (userId: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(!!userId);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const unsubscribe = subscribeToUserDocument(userId, (updatedUser) => {
      setUser(updatedUser);
      setIsLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [userId]);

  return { user, isLoading };
};

export default useRealtimeUser;
