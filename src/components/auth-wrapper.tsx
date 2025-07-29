"use client";

import React, { ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

import { createAnoUser } from "@/lib/actions/auth";
import { getCurrentUserFiles } from "@/lib/actions/file";
import useStore from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { setUser, setFiles } = useStore(
    useShallow((state) => ({
      setUser: state.setUser,
      setFiles: state.setFiles,
    })),
  );

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

  useEffect(() => {
    const handleUserFiles = async () => {
      try {
        const files = await getCurrentUserFiles();
        if (files && files.length > 0) {
          setFiles(files);
        } else {
          setFiles([]);
        }
      } catch (error) {
        console.error("Error in: handleUserFiles", error);
        const errMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch user files. please try again!";
        toast.error(errMessage);
      }
    };

    handleUserFiles();
  }, []);

  return <>{children}</>;
};

export default AuthWrapper;
