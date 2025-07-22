"use server";

import { createClient } from "../supabase/server";

const getUser = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }

    const { user } = data;

    return user;
  } catch (error) {
    console.error("Error in  getting user: getUser", error);
    const errMessage =
      error instanceof Error
        ? error.message
        : "Failed to get user. Please try after some time!";

    throw errMessage;
  }
};

const createAnoUser = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      throw new Error(error.message);
    }

    const user = data.user;

    return user;
  } catch (error) {
    console.error("Error in creating anonyms user: createAnoUser", error);
    const errMessage =
      error instanceof Error
        ? error.message
        : "Failed to create anonyms user. Please try after some time!";

    throw errMessage;
  }
};

export { getUser, createAnoUser };
