import { useState, useEffect } from 'react';

export const useAuthorization = (user) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHasAccess(false);
      setIsLoading(false);
      return;
    }

    const isSubscriber = user.subscriber || false;
    const isWithinTrial = user.trialEnd ? new Date(user.trialEnd) > new Date() : false;

    setHasAccess(isSubscriber || isWithinTrial);
    setIsLoading(false);

  }, [user]);

  return { hasAccess, isLoading };
};
