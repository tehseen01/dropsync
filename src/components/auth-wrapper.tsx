"use client";

import React, { ReactNode, useEffect } from "react";
import { toast } from "sonner";

import { createAnoUser, getUser } from "@/lib/actions/auth";
import useStore from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const setUser = useStore((state) => state.setUser);

  const supabase = createClient();

  useEffect(() => {
    const handleUser = async () => {
      try {
        const { error, data } = await supabase.auth.getUser();
        if (error || !data.user) {
          const newUser = await createAnoUser();
          setUser(newUser);
        }

        setUser(data.user);
      } catch (error) {
        console.error("Error in: handleUser", error);
        const errMessage =
          error instanceof Error
            ? error.message
            : "Failed to handle user session. please try again!";

        toast.error(errMessage);
      }
    };

    handleUser();
  }, []);
  return <>{children}</>;
};

export default AuthWrapper;
